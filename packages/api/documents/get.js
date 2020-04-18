const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const result = await dynamodb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      documentId: event.pathParameters.id,
    },
  })

  if (!result.Item) {
    throw new Error("Document not found")
  }

  return { data: result.Item }
})
