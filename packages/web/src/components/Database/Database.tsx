import React, { useState, useEffect } from "react"
import {
  addPouchPlugin,
  addRxPlugin,
  createRxDatabase,
  getRxStoragePouch,
} from "rxdb"
import { RxDBMigrationPlugin } from "rxdb/plugins/migration"
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb"
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"

import { useCurrentUser } from "../Auth"

import { MyDatabase, SyncStates, MyDatabaseCollections } from "./types"
import { encodeLocalDbName, initializeSync } from "./helpers"
import { DatabaseContext, SyncStateContext } from "./context"
import { dbNameBase, initialSyncState, usernameStartWord } from "./constants"
import models from "./models"
import { createDocumentPreSaveHook, createGroupPreInsertHook } from "."

addPouchPlugin(PouchDbAdapterIdb)
addPouchPlugin(PouchDbAdapterHttp) // enable syncing over http
addRxPlugin(RxDBMigrationPlugin)
addRxPlugin(RxDBReplicationCouchDBPlugin)
addRxPlugin(RxDBLeaderElectionPlugin)

// TODO: figure out the cause of the "invalid adapter: http" error and if it can impact the production environment IT MIGHT BE BECAUSE IT SHOULDN'T USE HTTP IN PROD BUT RATHER HTTPS, MAYBE BECAUSE THE APP IS RUNNING ON HTTPS AND CORS IS AN ISSUE, OR MAYBE SOMETHING ELSE. IF THIS FAILS, TRY SEARCHING POUCHDB SOURCE FOR THE ERROR AND SEE WHY IT'S THROWN

// TODO: make sure that the user is online and the database server is responding and all remote databases have been created and configured properly before creating local databases - throw an error otherwise because the frontend is unable to create databases with proper permissions and this will lead to many issues. Instead, if the user is online call a special api endpoint that will attempt to fix the remote database setup and if successful, the frontend should continue creating local databases and starting the app
// TODO: figure out encryption or local db removal
// TODO: finish cognito jwt auth once the new couchdb version is released
// TODO: make sure to wait for the userdata document(s) to come in before letting the user interact with the actual app (or use some fallback system, using locally saved data or defaults to prevent overwriting the userdata document stored in the remote db)
// TODO: eventually migrate to one shared userdata database with filtered queries and proper access control etc.
// TODO: better loading and error states

export const DatabaseProvider: React.FC = ({ children }) => {
  // const [isLoading, setIsLoading] = useState(true)
  // const [database, setDatabase] = useState<MyDatabase | null>(null)

  const [{ database, status }, setDatabaseState] = useState<{
    database: MyDatabase | null
    status: "LOADING" | "ERROR" | "READY"
  }>({ database: null, status: "LOADING" })

  const [syncState, setSyncState] = useState<SyncStates>(initialSyncState)
  const currentUser = useCurrentUser()

  // TODO: make sure that a new database is created when a different user logs in (this will probably crash the app right now because of how RxDB works)
  // TODO: re-running this might crash the app (make sure there are no unnecessary rerenders of this component and figure out a way to handle this error)
  useEffect(() => {
    ;(async () => {
      try {
        const username = currentUser.username
        const dbName = `${dbNameBase}${usernameStartWord}${username}`
        console.log("dbName:", dbName)
        console.log("endocedDbName:", encodeLocalDbName(dbName))
        const db = await createRxDatabase<MyDatabaseCollections>({
          name: encodeLocalDbName(dbName),
          storage: getRxStoragePouch("idb"),
          // pouchSettings: {
          //   // This doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
          //   skip_setup: true,
          // },
          // // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
          // ignoreDuplicate: true,
        })

        await db.addCollections(models)

        initializeSync(db, models, username, (val) => setSyncState(val))

        db.groups.preRemove(createGroupPreInsertHook(db), false)
        db.documents.preSave(createDocumentPreSaveHook(), false)

        db.waitForLeadership().then(() => {
          console.log("Long lives the king!") // <- runs when db becomes leader
        })

        // Write the database object to window for debugging TODO: disable in prod
        window["db"] = db

        setDatabaseState({ database: db, status: "READY" })
      } catch (e) {
        console.error(e)
        setDatabaseState({ database: null, status: "ERROR" })
      }
    })()
  }, [currentUser.username])

  switch (status) {
    case "LOADING":
      return <LoadingState />
    case "ERROR":
      return <ErrorState />
    case "READY":
      if (database) {
        return (
          <SyncStateContext.Provider value={syncState}>
            <DatabaseContext.Provider value={database}>
              {children}
            </DatabaseContext.Provider>
          </SyncStateContext.Provider>
        )
      } else {
        return <ErrorState />
      }
  }
}

const ErrorState: React.FC = () => <>Database setup error</>
const LoadingState: React.FC = () => <>Loading...</>
