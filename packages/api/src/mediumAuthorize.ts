import { Request, Response } from "express"

import { requestMediumAccessToken, getUserDetails } from "./helpers"

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
