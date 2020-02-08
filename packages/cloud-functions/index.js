const functions = require("firebase-functions")
const express = require("express")
const cors = require("cors")

const app = express()

const { MEDIUM_API_BASE_URL, MEDIUM_CLIENT_ID, API_ROUTES } = require("@writing-tool/constants")

// Allow cross-origin requests
app.use(cors({ origin: true }))

// Request access token from the Medium API
app.get(API_ROUTES.MEDIUM_REQUEST_ACCESS_TOKEN, async (req, res) => {
	const params = req.query

	const code = params.code
	const client_id = MEDIUM_CLIENT_ID
	const client_secret = functions.config().medium.client_secret
	const grant_type = "authorization_code"
	const redirect_uri = params.redirect_uri

	try {
		const mediumRes = await fetch(`${MEDIUM_API_BASE_URL}/tokens`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
				"Accept-Charset": "utf-8"
			},
			body:
				`code=${code}` +
				`&client_id=${client_id}` +
				`&client_secret=${client_secret}` +
				`&grant_type=${grant_type}` +
				`&redirect_uri=${redirect_uri}`
		})
		const data = await mediumRes.json()
		res.status(200).send({ data })
	} catch (error) {
		res.status(500).send({ error })
	}
})

// Expose Express API as a single Cloud Function:
exports.medium = functions.https.onRequest(app)
