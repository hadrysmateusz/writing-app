// Local workspace dependencies
const { API_ROUTES } = require("@writing-tool/shared")

// Third-Party dependencies
const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Local files
const mediumAuthorize = require("./mediumAuthorize")

const port = 4000
const app = express()

// MIDDLEWARE
app.use(cors({ origin: true })) // Allow cross-origin requests
app.use(express.json()) // Parse JSON requests

// ROUTES
app.post(API_ROUTES.MEDIUM_AUTHORIZE, mediumAuthorize) // Request access token from the Medium API
app.get("/", (req, res) => res.send("Hello World!"))

app.listen(port, () => console.log(`Listening on port ${port}`))
