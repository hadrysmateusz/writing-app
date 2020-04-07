import express, { Request, Response } from "express"

const router = express.Router()

// TODO: maybe only allow access to the currently authenticated user

router.get("/:id", (req: Request, res: Response) => {
  // get user info by id
})

router.put("/:id", (req: Request, res: Response) => {
  // update user info by id
})

export default router