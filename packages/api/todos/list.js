const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.main = async (event, context, callback) => {
  try {

    const userId = event.requestContext.identity.cognitoIdentityId || "USER_ABCD"

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    }
    
    const result = await dynamodb.query(params).promise()
    
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ data: result.Items }),
    }
    callback(null, response)
  } catch(error) {
    console.log(error)
    callback(error)
  }
}