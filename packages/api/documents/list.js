const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const result = await dynamodb.query({
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
  })

  return { data: result.Items }
})
