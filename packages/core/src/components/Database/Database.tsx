import React, { useState, useContext, createContext, useEffect } from "react"
import { addRxPlugin, createRxDatabase } from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"
import PouchDB from "pouchdb-core"
import { fetch } from "pouchdb-fetch"
import { Auth } from "aws-amplify"
import { documentSchema, groupSchema } from "./Schema"
import {
  MyDatabaseCollections,
  MyDatabase,
  DocumentDoc,
  DocumentCollection,
} from "./types"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) //enable syncing over http

const dbNameBase = "writing_tool" // TODO: change to the name of the app
const remoteDbDomain = "localhost"
const remoteDbPort = "5984"
const usernameStartWord: string = "__uid__"

const getUserRemoteDbName = (userName: string, tableName: string) => {
  return `uid-${userName}-${tableName}`
}

const validateDbName = (name: string): void => {
  if (!name.includes(usernameStartWord)) {
    throw new Error(
      `Not a proper name. Name must contain the string: ${usernameStartWord}`
    )
  }
}

const findDbUsername = (name: string): [string, number] => {
  const usernameIndex: number = name.indexOf("_uid_") + usernameStartWord.length
  const username: string = name.substring(usernameIndex)
  return [username, usernameIndex]
}

// The encode function only replaces the dashes in the username part of the string to prevent unexpected results when decoding if an iproper dbNameBase is used
// TODO: consider reimplementing with a regex (for possible startup performance improvement)
const encodeDbName = (name: string): string => {
  validateDbName(name)
  const [username, usernameIndex] = findDbUsername(name)
  console.log(username)
  return name.substring(0, usernameIndex) + username.replace(/-/g, "_")
}

const decodeDbName = (name: string): string => {
  validateDbName(name)
  const [username, usernameIndex] = findDbUsername(name)
  return name.substring(0, usernameIndex) + username.replace(/_/g, "-")
}

const DatabaseContext = createContext<MyDatabase | null>(null)

export const useDatabase = () => {
  const database = useContext(DatabaseContext)

  if (database === null) {
    throw new Error("Database is null")
  }

  return database
}

// TODO: figure out encryption or local db removal
// TODO: finish cognito jwt auth once the new couchdb version is released
export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [database, setDatabase] = useState<MyDatabase | null>(null)

  useEffect(() => {
    // TODO: (presumably because auth is in the web package - or just because the auth provider is above it) when logging-in to the same account after logging-out in one session this component gets remounted and the hook is run again causing the database to be created twice and an error is thrown
    console.log("RUNNING HOOK")
    const createDatabase = async () => {
      // TODO: probably extract this logic and expose these values in some higher context state to reduce redundancy
      const currentUser = await Auth.currentAuthenticatedUser()
      const username = currentUser?.username

      // TODO: better handling (although it might not be necessary because I think that almost nothing is loaded in the app until there is an authenticated user)
      if (!username) {
        throw new Error("No user found for database setup")
      }

      // create database
      console.log("DatabaseService: creating database..")
      const db = await createRxDatabase<MyDatabaseCollections>({
        name: encodeDbName(`${dbNameBase}${usernameStartWord}${username}`),
        adapter: "idb",
        ignoreDuplicate: true, // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
      })
      console.log("DatabaseService: created database")

      // write to window for debugging
      window["db"] = db

      const collections = [
        {
          name: "documents",
          schema: documentSchema,
          sync: true,
          statics: {
            findNotRemoved: function (this: DocumentCollection) {
              return this.find().where("isDeleted").eq(false)
            },
            findOneNotRemoved: function (this: DocumentCollection) {
              return this.findOne().where("isDeleted").eq(false)
            },
          },
          methods: {
            softRemove: function (this: DocumentDoc) {
              return this.update({
                $set: {
                  isDeleted: true,
                },
              })
            },
          },
          migrationStrategies: {},
        },
        {
          name: "groups",
          schema: groupSchema,
          sync: true,
        },
      ]

      // create collections
      console.log("DatabaseService: creating collections...")
      await Promise.all(collections.map((colData) => db.collection(colData)))
      console.log("DatabaseService: created collections")

      // // Hook that intercepts document remove calls and soft-deletes them instead
      // /*
      //   TODO: A way to permanently delete a document might be needed
      //   A possible solution is to use a flag that if present will prevent this hook for stopping the remove operation - it could be further improved with a custom method on the DocumentDoc that would automatically set the flag and remove it in one go
      // */
      // db.documents.preRemove((_, documentDoc) => {
      //   documentDoc.update({
      //     $set: {
      //       isDeleted: true,
      //     },
      //   })
      //   throw new Error(
      //     "Stopped document remove operation. Setting soft-delete flag instead."
      //   )
      // }, false)

      // Hook to remove nested groups and documents when a group is removed
      db.groups.preRemove(async (groupData) => {
        // Because the listeners are filed only after all hooks run, we await on all async actions to avoid de-sync issues
        // TODO: try moving all promises into a single Promise.all to parallelize for possible performance gains

        // Find all documents that are a direct child of this group
        const documents = await db.documents
          .find()
          .where("parentGroup")
          .eq(groupData.id)
          .exec()

        // Remove all children that are the child of this group.
        await Promise.all(
          documents.map(async (doc) => {
            try {
              doc.softRemove()
            } catch (error) {
              console.log(error)
            }
          })
        )

        // Find all groups that are a direct child of this group
        const groups = await db.groups
          .find()
          .where("parentGroup")
          .eq(groupData.id)
          .exec()

        // Remove all child groups (which should also trigger the hook to remove all nested docs)
        await Promise.all(groups.map((doc) => doc.remove()))
      }, false)

      // sync
      console.log("DatabaseService: setting up sync...")
      // TODO: check if sync returns a promise to be resolved
      // console.warn("Sync disabled: Check the Database.tsx file")

      collections
        .filter((col) => col.sync)
        .map((col) => col.name)
        .forEach((colName) => {
          // get the remote database(/table) name with the proper username prefix
          const dbName = getUserRemoteDbName(username, colName)

          db[colName].sync({
            remote: new PouchDB(
              `http://admin:kurczok99@${remoteDbDomain}:${remoteDbPort}/${dbName}/`,
              {
                fetch: (url, opts) => {
                  opts = {
                    ...opts,
                    credentials: "include", // TODO: investigate the necessity of this option for jwt auth
                  }

                  // TODO: set the Authorization header to "Bearer {CognitoJWT}" for jwt auth or use the headers below for proxy auth

                  // opts.headers = [["X-Auth-CouchDB-UserName", "test"]]

                  // opts.headers["X-Auth-CouchDB-UserName"] = "test"
                  // opts.headers["X-Auth-CouchDB-Token"] = "token"
                  // opts.headers["X-Auth-CouchDB-Roles"] = "couchroles"

                  // opts?.headers?.set("X-test", "test123")

                  return fetch(url, opts)
                },
              }
            ),
            waitForLeadership: true,
            options: {
              live: true,
              retry: true,
            },
          })
        })
      console.log("DatabaseService: sync set up")

      db.waitForLeadership().then(() => {
        console.log("Long lives the king!") // <- runs when db becomes leader
      })

      setDatabase(db) // TODO: check if a ref (or a simple global singleton) wouldn't be more appropriate
      setIsLoading(false)
    }

    createDatabase()
  }, [])

  console.log(isLoading, database)

  // TODO: better loading and error states
  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : database === null ? (
        "Database setup error"
      ) : (
        <DatabaseContext.Provider value={database}>
          {children}
        </DatabaseContext.Provider>
      )}
    </>
  )
}
