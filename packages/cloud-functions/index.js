const functions = require("firebase-functions")
const express = require("express")
const cors = require("cors")

const { API_ROUTES } = require("@writing-tool/constants")

const mediumAuthorize = require("./mediumAuthorize")

const app = express()

// Allow cross-origin requests
app.use(cors({ origin: true }))
// Parse JSON requests
app.use(express.json())

// Request access token from the Medium API
app.post(API_ROUTES.MEDIUM_AUTHORIZE, mediumAuthorize)

// Expose Express API as a single Cloud Function:
exports.medium = functions.https.onRequest(app)
