const fetch = require("node-fetch")

const COUCHDB_BASE_URL = "http://localhost:5984" // TODO: replace with actual url

// TODO: set up SSL

// Because this function is run in a trusted environment, I can simply use Basic authentication (provided that the actual credentials are safely stored)
// TODO: consider adding a different admin with limited permissions (if possible) to avoid using the main one
const getAdminAuthHeader = () => {
  // TODO: replace these placeholder credentials
  const ADMIN_USERNAME = "admin"
  const ADMIN_PASSWORD = "kurczok99"

  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  const encodedCredentials = Buffer.from(credentials).toString("base64")
  const authHeader = `Basic ${encodedCredentials}`

  return authHeader
}

const authHeader = getAdminAuthHeader()

/**
 * https://docs.couchdb.org/en/latest/api/database/common.html#put--db
 */
const createDatabase = async (dbName) => {
  try {
    const res = await fetch(`${COUCHDB_BASE_URL}/${dbName}`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    if (!res.ok) {
      const resData = await res.json()
      console.log(resData)
      throw new Error(resData)
    }
  } catch (error) {
    // TODO: handle errors
    throw error
  }
}

/**
 * https://docs.couchdb.org/en/latest/api/server/authn.html
 */
const setSecurity = async (userName, dbName) => {
  try {
    const reqBody = JSON.stringify({
      members: {
        roles: ["_admin"],
        names: [userName],
      },
      admins: {
        roles: ["_admin"],
      },
    })

    const res = await fetch(`${COUCHDB_BASE_URL}/${dbName}/_security`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
      body: reqBody,
    })

    if (!res.ok) {
      const resData = await res.json()
      console.log(resData)
      throw new Error(resData)
    }
  } catch (error) {
    // TODO: handle errors
    throw error
  }
}

const createDatabaseWithSecurity = async (userName, tableName) => {
  const dbName = `uid-${userName}-${tableName}`

  await createDatabase(dbName)
  await setSecurity(userName, dbName)
}

module.exports = {
  createDatabaseWithSecurity,
  getAdminAuthHeader,
}
