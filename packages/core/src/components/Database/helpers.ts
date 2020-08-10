import { usernameStartWord } from "./constants"

export const getUserRemoteDbName = (userName: string, tableName: string) => {
  return `uid-${userName}-${tableName}`
}

export const validateDbName = (name: string): void => {
  if (!name.includes(usernameStartWord)) {
    throw new Error(
      `Not a proper name. Name must contain the string: ${usernameStartWord}`
    )
  }
}

export const findDbUsername = (name: string): [string, number] => {
  const usernameIndex: number = name.indexOf("_uid_") + usernameStartWord.length
  const username: string = name.substring(usernameIndex)
  return [username, usernameIndex]
}

// The encode function only replaces the dashes in the username part of the string to prevent unexpected results when decoding if an improper dbNameBase is used
// TODO: consider reimplementing with a regex (for possible startup performance improvement)
export const encodeDbName = (name: string): string => {
  validateDbName(name)
  const [username, usernameIndex] = findDbUsername(name)
  return name.substring(0, usernameIndex) + username.replace(/-/g, "_")
}

export const decodeDbName = (name: string): string => {
  validateDbName(name)
  const [username, usernameIndex] = findDbUsername(name)
  return name.substring(0, usernameIndex) + username.replace(/_/g, "-")
}
