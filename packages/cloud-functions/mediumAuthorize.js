const fetch = require("node-fetch")
const functions = require("firebase-functions")
const { MEDIUM_API_BASE_URL, MEDIUM_CLIENT_ID } = require("@writing-tool/constants")

module.exports = async (req, res) => {
	const body = req.body

	const code = body.code
	const redirect_uri = body.redirect_uri

	const { error: authError, data: authData } = await requestMediumAccessToken(code, redirect_uri)
	if (authError) {
		throw new Error("Couldn't get access token: " + authError)
	}

	// TODO: store the tokens safely - this is just a temporary solution

	const { error: userError, data: userData } = await getUserDetails(authData.access_token)
	if (userError) {
		throw new Error("Couldn't get user details: " + userError)
	}

	try {
		res.status(200).send({ user: userData })
	} catch (error) {
		res.status(500).send({ error })
	}
}

async function requestMediumAccessToken(code, redirect_uri) {
	try {
		const client_id = MEDIUM_CLIENT_ID
		const client_secret = functions.config().medium.client_secret
		const grant_type = "authorization_code"

		const res = await fetch(`${MEDIUM_API_BASE_URL}/tokens`, {
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

		const data = await res.json()

		if (data.errors) throw new Error(JSON.stringify(data.errors))
		// TODO: better response schema validation
		if (!data.access_token || !data.refresh_token) throw new Error("Tokens aren't present in the response")

		getTokenTTL(data.expires_at)

		return { data }
	} catch (error) {
		return { error }
	}
}

async function getUserDetails(access_token) {
	try {
		// Throw instantly if the access_token provided is invalid
		if (typeof access_token !== "string") {
			throw new Error("Invalid access token")
		}

		// Fetch user details from medium api
		const res = await fetch(`${MEDIUM_API_BASE_URL}/tokens`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})

		// Handle status codes outside the 200-299 range
		if (!res.ok) {
			switch (res.status) {
				case 401:
					// Unauthorized
					// TODO: request new access token with the refresh token and try again once, if fails again throw Unauthorized error
					throw new Error("Unauthorized")
				default:
					throw new Error(`Medium API returned status code ${res.status}`)
			}
		}

		const { data } = await res.json()

		return { data }
	} catch (error) {
		return { error }
	}
}

function getTokenTTL(expires_at) {
	const now = new Date(expires_at)
	const tokenExpiration = new Date(Date.now())

	var res = Math.abs(now - tokenExpiration) / 1000

	// get total days between two dates
	var days = Math.floor(res / 86400)
	console.log("Difference (Days): " + days)

	// get hours
	var hours = Math.floor(res / 3600) % 24
	console.log("Difference (Hours): " + hours)

	// get minutes
	var minutes = Math.floor(res / 60) % 60
	console.log("Difference (Minutes): " + minutes)

	// get seconds
	var seconds = res % 60
	console.log("Difference (Seconds): " + seconds)
}
