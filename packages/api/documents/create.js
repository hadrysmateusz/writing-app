const uuid = require("uuid")
const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const body = JSON.parse(event.body)
  const content = body.content

  const item = {
    userId: event.requestContext.identity.cognitoIdentityId,
    documentId: uuid.v1(),
    content: content,
  }

  await dynamodb.put({
    TableName: process.env.DYNAMODB_TABLE,
    Item: item,
  })

  return { data: item }
})