const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const userId = event.requestContext.identity.cognitoIdentityId
  const documentId = event.pathParameters.id

  const result = await dynamodb.get({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      userId: userId,
      documentId: documentId,
    },
  })

  if (!result.Item) {
    throw new Error("Document not found")
  }

  return { data: result.Item }
})
