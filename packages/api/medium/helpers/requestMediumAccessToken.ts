import fetch from "node-fetch"
import { MEDIUM_API_BASE_URL, MEDIUM_CLIENT_ID } from "shared"

export async function requestMediumAccessToken(code, redirect_uri) {
  try {
    const client_id = MEDIUM_CLIENT_ID
    const client_secret = process.env.MEDIUM_CLIENT_SECRET
    const grant_type = "authorization_code"

    const res = await fetch(`${MEDIUM_API_BASE_URL}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Accept-Charset": "utf-8",
      },
      body:
        `code=${code}` +
        `&client_id=${client_id}` +
        `&client_secret=${client_secret}` +
        `&grant_type=${grant_type}` +
        `&redirect_uri=${redirect_uri}`,
    })

    const data = await res.json()

    if (data.errors) throw new Error(JSON.stringify(data.errors))
    // TODO: better response schema validation
    if (!data.access_token || !data.refresh_token)
      throw new Error("Tokens aren't present in the response")

    // Last time I checked medium access tokens expire after 60 days

    return data
  } catch (error) {
    throw new Error("Couldn't get access token: " + error.message)
  }
}
