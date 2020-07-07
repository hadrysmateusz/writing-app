"use strict"

const { handler } = require("../utils")
const { createDatabaseWithSecurity } = require("./helpers")

// Mock event template - https://github.com/serverless/event-mocks/blob/master/lib/events/aws/cognito-user-pool-event-template.json

module.exports.main = handler(async (event, context) => {
  const { userName, triggerSource } = event

  // TODO: consider additional security checks

  // exit silently if the event is not post post sign up
  if (triggerSource !== "PostConfirmation_ConfirmSignUp") return

  await createDatabaseWithSecurity(userName, "documents")
  await createDatabaseWithSecurity(userName, "groups")

  // TODO: add an entry to a user database (which should have some per-document security - probably done with design documents, maybe use the _users database if it won't conflict with jwt authentication)
})
