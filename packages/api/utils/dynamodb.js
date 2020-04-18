const AWS = require("aws-sdk")
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports = {
  get   : (params) => dynamodb.get(params).promise(),
  put   : (params) => dynamodb.put(params).promise(),
  query : (params) => dynamodb.query(params).promise(),
  update: (params) => dynamodb.update(params).promise(),
  delete: (params) => dynamodb.delete(params).promise(),
}