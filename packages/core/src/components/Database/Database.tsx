import React, { useState, useContext, createContext, useEffect } from "react"
import { addRxPlugin, createRxDatabase, RxCollectionCreator } from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"
import PouchDB from "pouchdb-core"
import { fetch } from "pouchdb-fetch" // TODO: create declaration file
import { Auth } from "aws-amplify"
import { documentSchema, groupSchema, userdataSchema } from "./Schema"
import {
  MyDatabaseCollections,
  MyDatabase,
  DocumentDoc,
  DocumentCollection,
} from "./types"
import { config } from "../../dev-tools"
import {
  remoteDbDomain,
  remoteDbPort,
  usernameStartWord,
  dbNameBase,
} from "./constants"
import { encodeDbName, getUserRemoteDbName } from "./helpers"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) // enable syncing over http

// TODO: replace with custom createContext
const DatabaseContext = createContext<MyDatabase | null>(null)
export const useDatabase = () => {
  const database = useContext(DatabaseContext)

  if (database === null) {
    throw new Error("Database is null")
  }

  return database
}

// TODO: figure out the cause of the "invalid adapter: http" error and if it can impact the production environment
// TODO: make sure that the user is online and the database server is responding and all remote databases have been created and configured properly before creating local databases - throw an error otherwise because the frontend is unable to create databases with proper permissions and this will lead to many issues. Instead, if the user is online call a special api endpoint that will attempt to fix the remote database setup and if successful, the frontend should continue creating local databases and starting the app
// TODO: figure out encryption or local db removal
// TODO: finish cognito jwt auth once the new couchdb version is released
// TODO: make sure to wait for the userdata document(s) to come in before letting the user interact with the actual app (or use some fallback system, using locally saved data or defaults to prevent overwriting the userdata document stored in the remote db)
// TODO: eventually migrate to one shared userdata database with filtered queries and proper access control etc.
export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [database, setDatabase] = useState<MyDatabase | null>(null)

  useEffect(() => {
    // TODO: (presumably because auth is in the web package - or just because the auth provider is above it) when logging-in to the same account after logging-out in one session this component gets remounted and the hook is run again causing the database to be created twice and an error is thrown
    const createDatabase = async () => {
      // TODO: probably extract this logic and expose these values in some higher context state to reduce redundancy
      const currentUser = await Auth.currentAuthenticatedUser()
      const username = currentUser?.username

      // TODO: better handling (although it might not be necessary because I think that almost nothing is loaded in the app until there is an authenticated user)
      if (!username) {
        throw new Error("No user found for database setup")
      }

      // create database
      const db = await createRxDatabase<MyDatabaseCollections>({
        name: encodeDbName(`${dbNameBase}${usernameStartWord}${username}`),
        adapter: "idb",
        pouchSettings: {
          // This doesn't seem to work as expected and should probably be replaced with manualy checks and simply not calling the create functions if they fail
          skip_setup: true,
        },
        ignoreDuplicate: true, // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
      })

      // write to window for debugging
      // TODO: disable in prod
      window["db"] = db

      const collections: (RxCollectionCreator & {
        /**
         * Custom property, indicates if the collection should be automatically synced with remote db
         */
        sync: boolean
      })[] = [
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
          pouchSettings: {
            // This doesn't seem to work as expected and should probably be replaced with manualy checks and simply not calling the create functions if they fail
            skip_setup: true,
          },
        },
        {
          name: "groups",
          schema: groupSchema,
          sync: true,
          pouchSettings: {
            // This doesn't seem to work as expected and should probably be replaced with manualy checks and simply not calling the create functions if they fail
            skip_setup: true,
          },
        },
        {
          name: "userdata",
          schema: userdataSchema,
          sync: true,
          pouchSettings: {
            // This doesn't seem to work as expected and should probably be replaced with manualy checks and simply not calling the create functions if they fail
            skip_setup: true,
          },
        },
      ]

      // create collections
      await Promise.all(collections.map((colData) => db.collection(colData)))

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
      if (config.dbSync) {
        // TODO: check if sync returns a promise to be resolved

        collections
          .filter((col) => col.sync)
          .map((col) => col.name)
          .forEach((colName) => {
            // get the remote database(/table) name with the proper username prefix
            const dbName = getUserRemoteDbName(username, colName)

            db[colName].sync({
              remote: new PouchDB(
                // TODO: when jwt auth is fixed, remove the admin credentials from this url and add the proper headers
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
                  skip_setup: true,
                }
              ),
              waitForLeadership: true,
              options: {
                live: true,
                retry: true,
              },
            })
          })
      } else {
        console.warn("Sync disabled: Check the Database.tsx file")
      }

      db.waitForLeadership().then(() => {
        console.log("Long lives the king!") // <- runs when db becomes leader
      })

      setDatabase(db) // TODO: check if a ref (or a simple global singleton) wouldn't be more appropriate
      setIsLoading(false)
    }

    createDatabase()
  }, [])

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
