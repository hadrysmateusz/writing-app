const functions = require("firebase-functions")
const { MEDIUM_API_BASE_URL, MEDIUM_CLIENT_ID } = require("@writing-tool/constants")

module.exports = async (req, res) => {
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
		// TODO: store the token safely
		res.status(200).send({ data })
	} catch (error) {
		res.status(500).send({ error })
	}
}
