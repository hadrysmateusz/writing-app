import { usernameStartWord } from "../constants"

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
