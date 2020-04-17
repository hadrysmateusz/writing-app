import fetch from "node-fetch"
import { MEDIUM_API_BASE_URL } from "@writing-tool/shared"

export async function getMediumUserDetails(access_token) {
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
