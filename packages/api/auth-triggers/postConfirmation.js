const { handler } = require("../utils")
const { createDatabaseWithSecurity } = require("./helpers")

// Mock event template - https://github.com/serverless/event-mocks/blob/master/lib/events/aws/cognito-user-pool-event-template.json

module.exports.main = handler(async (event, context) => {
  const { userName, triggerSource } = event

  // TODO: consider additional security checks (source validation etc.)

  // exit silently if the event is not post sign up
  if (triggerSource !== "PostConfirmation_ConfirmSignUp") return

  // TODO: if some database(s) fail to be created, others are still left there, there should be an indempotent way of retrying this - probably retry the functions and just ignore a database if it's already created
  await createDatabaseWithSecurity(userName, "documents")
  await createDatabaseWithSecurity(userName, "groups")
  await createDatabaseWithSecurity(userName, "userdata")

  // TODO: add an entry to a user database (which should have some per-document security - probably done with design documents, maybe use the _users database if it won't conflict with jwt authentication)
})
