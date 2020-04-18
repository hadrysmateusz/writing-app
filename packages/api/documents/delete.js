const dynamodb = require("../utils/dynamodb")
const handler = require("../utils/handler")

module.exports.main = handler(async (event, context) => {
  const result = await dynamodb.delete({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      documentId: event.pathParameters.id,
    },
    ReturnValues: "ALL_OLD"
  })

  // TODO: better handle the case where nothing is deleted because the primary key doesn't match any item in the table - currently an empty object is returned (which might be fine but has to be handled on the client-side)
  return { data: result.Attributes }
})
