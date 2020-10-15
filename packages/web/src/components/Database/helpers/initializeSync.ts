import PouchDB from "pouchdb-core"
import { fetch } from "pouchdb-fetch" // TODO: create declaration file
import { RxCollection } from "rxdb"

import { config } from "../../../dev-tools"

import { remoteDbDomain, remoteDbPort, initialSyncState } from "../constants"
import { MyModel, MyDatabase, SyncState, SyncStates } from "../types"

/**
 * Create a remote CouchDB database name for a given user and RxDB collection
 *
 * @param username username of the owner
 * @param tableName local RxDB collection name
 */
export const getRemoteDatabaseName = (username: string, tableName: string) => {
  return `uid-${username}-${tableName}`
}

export const createRemotePouchDB = (
  userName: string,
  collectionName: string
): PouchDB.Database => {
  // get the remote database(/table) name with the proper username prefix
  // TODO: consider making this a static method of collections
  const dbName = getRemoteDatabaseName(userName, collectionName)

  const remoteDB = new PouchDB(
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
  )

  return remoteDB
}

export const setUpSyncForCollection = (
  collection: RxCollection,
  username: string
): SyncState => {
  const remoteDB = createRemotePouchDB(username, collection.name)

  const replicationState = collection.sync({
    remote: remoteDB,
    waitForLeadership: true,
    options: {
      live: true,
      retry: true,
    },
  })

  return { remoteDB, replicationState }
}

export const initializeSync = (
  db: MyDatabase,
  /**
   * TODO: see if I can override the DB type to include options on collections, this way I will be able to use db.collections here instead of an argument
   */
  collections: MyModel[],
  username: string,
  /**
   * Function to update state with the syncState value
   */
  onChange: (value: SyncStates) => void
) => {
  try {
    if (config.dbSync) {
      const tempSyncState = initialSyncState

      collections
        .filter((col) => col.options.sync)
        .forEach((col) => {
          const state = setUpSyncForCollection(db[col.name], username)

          if (col.name === "documents") {
            console.log(state)
          }

          tempSyncState[col.name] = state
        })

      onChange(tempSyncState)
    } else {
      console.warn("Sync disabled: Check the Database.tsx file")
    }
  } catch (error) {
    console.error("Failed to set up remote sync")
    console.error(error)
  }
}
