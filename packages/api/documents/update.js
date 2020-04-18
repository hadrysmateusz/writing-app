const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const data = JSON.parse(event.body)

  const result = await dynamodb.update({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      documentId: event.pathParameters.id,
    },
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": data.content || null,
    },
    ReturnValues: "ALL_NEW"
  })

  return { data: result.Attributes }
})
