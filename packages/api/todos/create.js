const AWS = require("aws-sdk")

const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.main = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const userId = body.userId
  const documentId = body.documentId
  const content = body.content

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      userId: userId,
      documentId: documentId,
      content: content,
    }
  }

  try {
    await dynamodb.put(params).promise()
    const response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "successfully added"}),
    }
    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
