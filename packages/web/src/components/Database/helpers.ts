import PouchDB from "pouchdb-core"
import { fetch } from "pouchdb-fetch" // TODO: create declaration file
import { createRxDatabase, RxCollection } from "rxdb"

import { config } from "../../dev-tools"

import {
  dbNameBase,
  usernameStartWord,
  remoteDbDomain,
  remoteDbPort,
  initialSyncState,
} from "./constants"
import {
  MyCollectionCreator,
  MyDatabase,
  MyDatabaseCollections,
  SyncState,
  SyncStates,
} from "./types"

/**
 * Create a remote CouchDB database name for a given user and RxDB collection
 *
 * @param username username of the owner
 * @param tableName local RxDB collection name
 */
export const getRemoteDatabaseName = (username: string, tableName: string) => {
  return `uid-${username}-${tableName}`
}

/**
 * Extracts the uid from a local RxDB database name
 */
export const getUsernameFromLocalDbName = (
  dbName: string
): [string, number] => {
  const usernameIndex = dbName.indexOf("_uid_") + usernameStartWord.length
  const username = dbName.substring(usernameIndex)
  return [username, usernameIndex]
}

/**
 * Checks if the string is a valid local RxDB database name
 */
export const validateLocalDbName = (name: string): void => {
  const common = `Invalid local db name. `

  // Check if the string contains the username start word (used to separate the base name from the uid)
  if (!name.includes(usernameStartWord)) {
    throw new Error(
      common + `Name must contain the string: ${usernameStartWord}`
    )
  }
}

/**
 * Replaces dashes in the username part of the string to create a valid RxDB database name
 *
 * @todo consider reimplementing with a regex (for possible startup performance improvement)
 */
export const encodeLocalDbName = (name: string): string => {
  validateLocalDbName(name)
  const [username, usernameIndex] = getUsernameFromLocalDbName(name)
  return name.substring(0, usernameIndex) + username.replace(/-/g, "_")
}

export const decodeLocalDbName = (name: string): string => {
  validateLocalDbName(name)
  const [username, usernameIndex] = getUsernameFromLocalDbName(name)
  return name.substring(0, usernameIndex) + username.replace(/_/g, "-")
}

/**
 * Generates a name for the local RxDB database. Uses the user's uid to make it unique for every user that logs in on the same machine.
 */
export const generateLocalDbName = (username: string) => {
  return encodeLocalDbName(`${dbNameBase}${usernameStartWord}${username}`)
}

export const createLocalDB = async (username: string): Promise<MyDatabase> => {
  const db = await createRxDatabase<MyDatabaseCollections>({
    name: generateLocalDbName(username),
    adapter: "idb",
    pouchSettings: {
      // This doesn't seem to work as expected and should probably be replaced with manual checks and simply not calling the create functions if they fail
      skip_setup: true,
    },
    // TODO: this flag is set to address the issue with the auth provider remounting the component after logging in to the same account twice but it probably will have some unintended consequences so try to find a better solution
    ignoreDuplicate: true,
  })

  return db
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

export const setUpSync = (
  db: MyDatabase,
  /**
   * TODO: see if I can override the DB type to include options on collections, this way I will be able to use db.collections here instead of an argument
   */
  collections: MyCollectionCreator[],
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

export const createCollections = async (
  db: MyDatabase,
  collections: MyCollectionCreator[]
) => {
  return await Promise.all(collections.map((colData) => db.collection(colData)))
}
