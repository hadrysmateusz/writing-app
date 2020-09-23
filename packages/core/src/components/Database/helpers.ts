import { Auth } from "aws-amplify"
import { dbNameBase, usernameStartWord } from "./constants"

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

// TODO: probably extract this logic and expose these values in some higher context state to reduce redundancy
export const getUsername = async () => {
  const currentUser = await Auth.currentAuthenticatedUser()
  const username = currentUser?.username

  // TODO: better handling (although it might not be necessary because I think that almost nothing is loaded in the app until there is an authenticated user)
  if (!username) {
    throw new Error("No user found for database setup")
  }

  return username
}
