"use strict"

import { requestMediumAccessToken, getMediumUserDetails } from "../../helpers"

module.exports.authorize = async (event, _context, callback) => {
  try {
    const body = JSON.parse(event.body)
    // TODO: some validation is required
    const { code, redirect_uri } = body

    const authData = await requestMediumAccessToken(code, redirect_uri)
    // TODO: store the tokens safely - this is just a temporary solution
    const userData = await getMediumUserDetails(authData.access_token)

    callback(null, { statusCode: 200, body: JSON.stringify(userData) })
  } catch (error) {
    callback(error)
  }
}
