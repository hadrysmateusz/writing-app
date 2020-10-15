import React, { useState, useEffect } from "react"
import {
  addRxPlugin,
  createRxDatabase,
  RxCollectionCreator,
  RxReplicationState,
} from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"
import PouchDB from "pouchdb-core"
import { fetch } from "pouchdb-fetch" // TODO: create declaration file

import { config } from "../../dev-tools"

import { remoteDbDomain, remoteDbPort } from "./constants"
import { generateLocalDbName, getRemoteDatabaseName } from "./helpers"
import {
  documentSchema,
  groupSchema,
  localSettingsSchema,
  userdataSchema,
} from "./Schema"
import {
  MyDatabaseCollections,
  MyDatabase,
  DocumentDoc,
  DocumentCollection,
  CollectionNames,
} from "./types"
import { DatabaseContext } from "./context"
import { useCurrentUser } from "../Auth"
// import { cloneDeep } from "lodash"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) // enable syncing over http

// TODO: figure out the cause of the "invalid adapter: http" error and if it can impact the production environment
// TODO: make sure that the user is online and the database server is responding and all remote databases have been created and configured properly before creating local databases - throw an error otherwise because the frontend is unable to create databases with proper permissions and this will lead to many issues. Instead, if the user is online call a special api endpoint that will attempt to fix the remote database setup and if successful, the frontend should continue creating local databases and starting the app
// TODO: figure out encryption or local db removal
// TODO: finish cognito jwt auth once the new couchdb version is released
// TODO: make sure to wait for the userdata document(s) to come in before letting the user interact with the actual app (or use some fallback system, using locally saved data or defaults to prevent overwriting the userdata document stored in the remote db)
// TODO: eventually migrate to one shared userdata database with filtered queries and proper access control etc.
export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [database, setDatabase] = useState<MyDatabase | null>(null)
  const currentUser = useCurrentUser()

  useEffect(() => {
    // TODO: make sure that a new database is created when a different user logs in (this will probably crash the app right now because of how RxDB works)
    // TODO: re-running this might crash the app (make sure there are no unnecessary rerenders of this component and figure out a way to handle this error)
    const createDatabase = async () => {
      const username = currentUser.username

      // Create RxDB database
      const db = await createRxDatabase<MyDatabaseCollections>({
        name: generateLocalDbName(username),
        adapter: "idb",
        pouchSettings: {
          // This doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
          skip_setup: true,
        },
        ignoreDuplicate: true, // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
      })

      // Write the database object to window for debugging
      // TODO: disable in prod
      window["db"] = db

      // TODO: skip_setup doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
      const collections: (RxCollectionCreator & {
        name: CollectionNames
        /**
         * Custom properties
         */
        options: {
          /**
           * Indicates if the collection should be automatically synced with remote db
           */
          sync: boolean
        }
      })[] = [
        {
          name: CollectionNames.documents,
          schema: documentSchema,
          statics: {
            findNotRemoved(this: DocumentCollection) {
              return this.find().where("isDeleted").eq(false)
            },
            findOneNotRemoved(this: DocumentCollection) {
              return this.findOne().where("isDeleted").eq(false)
            },
          },
          methods: {
            softRemove(this: DocumentDoc) {
              return this.update({
                $set: {
                  isDeleted: true,
                },
              })
            },
          },
          migrationStrategies: {},
          pouchSettings: {
            skip_setup: true,
          },
          options: {
            sync: true,
          },
        },
        {
          name: CollectionNames.groups,
          schema: groupSchema,
          statics: {},
          migrationStrategies: {},
          pouchSettings: {
            skip_setup: true,
          },
          options: {
            sync: true,
          },
        },
        {
          name: CollectionNames.userdata,
          schema: userdataSchema,
          pouchSettings: {
            skip_setup: true,
          },
          options: {
            sync: true,
          },
        },
        {
          name: CollectionNames.local_settings,
          schema: localSettingsSchema,
          migrationStrategies: {},
          pouchSettings: {
            skip_setup: true,
          },
          options: {
            sync: false,
          },
        },
      ]

      // create collections
      await Promise.all(collections.map((colData) => db.collection(colData)))

      //#region Set up hooks

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

      // Hook to update the modifiedAt field on every update
      db.documents.preSave(async (data, doc) => {
        // TODO: check for changes, if there aren't any, don't update the modifiedAt date
        data.modifiedAt = Date.now()
      }, false)

      //#endregion

      // An object that will hold replication state for each collection
      const replicationState: Partial<Record<
        CollectionNames,
        RxReplicationState
      >> = {}

      // Set up cloud sync
      try {
        if (config.dbSync) {
          collections
            .filter((col) => col.options.sync)
            .forEach((col) => {
              // get the remote database(/table) name with the proper username prefix
              // TODO: consider making this a static method of collections
              const dbName = getRemoteDatabaseName(username, col.name)

              const state = db[col.name].sync({
                remote: new PouchDB(
                  // TODO: when jwt auth is fixed, remove the admin credentials from this url and add the proper headers
                  `http://admin:kurczok99@${remoteDbDomain}:${remoteDbPort}/${dbName}/`,
                  {
                    fetch: (url, opts) => {
                      // TODO: set the Authorization header to "Bearer {CognitoJWT}" for jwt auth or use the headers below for proxy auth
                      opts = {
                        ...opts,
                        credentials: "include", // TODO: investigate the necessity of this option for jwt auth
                      }

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

              replicationState[col.name] = state
            })
        } else {
          console.warn("Sync disabled: Check the Database.tsx file")
        }
      } catch (error) {
        console.error("Failed to set up remote sync")
        console.error(error)
      }

      // TODO: these listeners are only temporary & for testing, figure out how to use them

      // console.log(replicationState)

      // replicationState?.documents?.change$.subscribe((...args) => {
      //   console.log("change", cloneDeep(args), args)
      // })

      // replicationState.documents?.active$.subscribe((...args) => {
      //   console.log("active", ...args)
      // })

      // // replicationState.documents?.complete$.subscribe((...args) => {
      // //   console.log("complete", ...args)
      // // })

      // replicationState.documents?.alive$.subscribe((...args) => {
      //   console.log("alive", ...args)
      // })

      // replicationState.documents?.denied$.subscribe((...args) => {
      //   console.log("denied", ...args)
      // })

      // replicationState.documents?.docs$.subscribe((...args) => {
      //   console.log("docs", ...args)
      // })

      // replicationState.documents?.error$.subscribe((...args) => {
      //   console.log("error", ...args)
      // })

      // db.waitForLeadership().then(() => {
      //   console.log("Long lives the king!") // <- runs when db becomes leader
      // })

      setDatabase(db) // TODO: check if a ref (or a simple global singleton) wouldn't be more appropriate
      setIsLoading(false)
    }

    createDatabase()
  }, [currentUser.username])

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
