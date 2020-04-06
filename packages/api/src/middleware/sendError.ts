import { Request, Response, NextFunction } from "express"

/**
 * Error handling middleware which returns the thrown error as a server response.
 */
export const sendError = (
  error: { message: string; status: number },
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || 500)
  res.json({
    status: "error",
    message: error.message,
  })
  next()
}