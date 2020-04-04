import fetch from "node-fetch"
import { Request, Response } from "express"

import { MEDIUM_API_BASE_URL, MEDIUM_CLIENT_ID } from "@writing-tool/shared"

export default async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { code, redirect_uri } = body

    const authData = await requestMediumAccessToken(code, redirect_uri)
    // TODO: store the tokens safely - this is just a temporary solution
    const userData = await getUserDetails(authData.access_token)

    res.status(200).send({ data: userData })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

async function requestMediumAccessToken(code, redirect_uri) {
  try {
    const client_id = MEDIUM_CLIENT_ID
    const client_secret = process.env.MEDIUM_CLIENT_SECRET
    const grant_type = "authorization_code"

    const res = await fetch(`${MEDIUM_API_BASE_URL}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
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

async function getUserDetails(access_token) {
  try {
    // Throw instantly if the access_token provided is invalid
    if (typeof access_token !== "string") {
      throw new Error("Invalid access token")
    }

    // Fetch user details from medium api
    const res = await fetch(`${MEDIUM_API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
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

    return data
  } catch (error) {
    throw new Error("Couldn't get user details: " + error.message)
  }
}
