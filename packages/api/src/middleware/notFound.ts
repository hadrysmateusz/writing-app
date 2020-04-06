import { Request, Response, NextFunction } from "express"

/**
 * Middleware which throws a "Route Not found" error when hit. Should be added after all routes.
 */
export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error("Route Not found")
  next(error)
}
