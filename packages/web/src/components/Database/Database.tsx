import React, { useState, useEffect } from "react"
import { addRxPlugin } from "rxdb"
import PouchDbAdapterIdb from "pouchdb-adapter-idb"
import PouchDbAdapterHttp from "pouchdb-adapter-http"

import { useCurrentUser } from "../Auth"

import { MyDatabase, SyncStates } from "./types"
import { createCollections, createLocalDB, setUpSync } from "./helpers"
import { DatabaseContext, SyncStateContext } from "./context"
import { initialSyncState } from "./constants"
import models from "./models"

addRxPlugin(PouchDbAdapterIdb)
addRxPlugin(PouchDbAdapterHttp) // enable syncing over http

// TODO: figure out the cause of the "invalid adapter: http" error and if it can impact the production environment IT MIGHT BE BECAUSE IT SHOULDN'T USE HTTP IN PROD BUT RATHER HTTPS, MAYBE BECAUSE THE APP IS RUNNING ON HTTPS AND CORS IS AN ISSUE, OR MAYBE SOMETHING ELSE. IF THIS FAILS, TRY SEARCHING POUCHDB SOURCE FOR THE ERROR AND SEE WHY IT'S THROWN

// TODO: make sure that the user is online and the database server is responding and all remote databases have been created and configured properly before creating local databases - throw an error otherwise because the frontend is unable to create databases with proper permissions and this will lead to many issues. Instead, if the user is online call a special api endpoint that will attempt to fix the remote database setup and if successful, the frontend should continue creating local databases and starting the app
// TODO: figure out encryption or local db removal
// TODO: finish cognito jwt auth once the new couchdb version is released
// TODO: make sure to wait for the userdata document(s) to come in before letting the user interact with the actual app (or use some fallback system, using locally saved data or defaults to prevent overwriting the userdata document stored in the remote db)
// TODO: eventually migrate to one shared userdata database with filtered queries and proper access control etc.
// TODO: better loading and error states

export const DatabaseProvider: React.FC<{}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [database, setDatabase] = useState<MyDatabase | null>(null)
  const [syncState, setSyncState] = useState<SyncStates>(initialSyncState)
  const currentUser = useCurrentUser()

  useEffect(() => {
    // TODO: make sure that a new database is created when a different user logs in (this will probably crash the app right now because of how RxDB works)
    // TODO: re-running this might crash the app (make sure there are no unnecessary rerenders of this component and figure out a way to handle this error)
    const initialize = async () => {
      const username = currentUser.username

      const db = await createLocalDB(username)

      await createCollections(db, models)
      setUpSync(db, models, username, (val) => setSyncState(val))

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

      db.waitForLeadership().then(() => {
        console.log("Long lives the king!") // <- runs when db becomes leader
      })

      // Write the database object to window for debugging TODO: disable in prod
      window["db"] = db

      setDatabase(db)
      setIsLoading(false)
    }

    initialize()
  }, [currentUser.username])

  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : database === null ? (
        "Database setup error"
      ) : (
        <SyncStateContext.Provider value={syncState}>
          <DatabaseContext.Provider value={database}>
            {children}
          </DatabaseContext.Provider>
        </SyncStateContext.Provider>
      )}
    </>
  )
}
