const functions = require("firebase-functions")
const express = require("express")
const cors = require("cors")

const { API_ROUTES } = require("@writing-tool/constants")

const mediumRequestAccessToken = require("./mediumRequestAccessToken")

const app = express()

// Allow cross-origin requests
app.use(cors({ origin: true }))

// Request access token from the Medium API
app.get(API_ROUTES.MEDIUM_REQUEST_ACCESS_TOKEN, mediumRequestAccessToken)

// Expose Express API as a single Cloud Function:
exports.medium = functions.https.onRequest(app)
