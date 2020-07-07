"use strict"

// https://github.com/serverless/event-mocks/blob/master/lib/events/aws/cognito-user-pool-event-template.json

const COUCHDB_BASE_URL = "http://localhost:5984"
// TODO: set up SSL
// TODO: replace these placeholder credentials
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "kurczok99"

const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
const encodedCredentials = Buffer.from(credentials).toString("base64")

const authHeader = `Basic ${encodedCredentials}`

const handler = (lambda) => async (event, context) => {
  return (
    Promise.resolve()
      // Run the Lambda
      .then(() => lambda(event, context))
      // On success
      .then((responseBody) => [200, responseBody])
      // On failure
      .catch((e) => {
        console.log(e)
        return [500, { error: e.message }]
      })
      // Return HTTP response
      .then(([statusCode, body]) => ({
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(body),
      }))
  )
}

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

module.exports.hello = handler(async (event, context) => {
  const { userName, triggerSource } = event

  // TODO: consider additional security checks

  // exit silently if the event is not post post sign up
  if (triggerSource !== "PostConfirmation_ConfirmSignUp") return

  await createDatabaseWithSecurity(userName, "documents")
  await createDatabaseWithSecurity(userName, "groups")

  // TODO: add an entry to a user database (which should have some per-document security - probably done with design documents, maybe use the _users database if it won't conflict with jwt authentication)
})
