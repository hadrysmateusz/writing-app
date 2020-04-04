// Third-Party dependencies
import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"

// Local workspace dependencies
import { API_ROUTES } from "@writing-tool/shared"

// Local files
import mediumAuthorize from "./mediumAuthorize"

// Read environment variables from .env file
dotenv.config()

const PORT: any = process.env.PORT || 4000

const app: Application = express()

app.use(cors({ origin: true })) // Allow cross-origin requests
app.use(express.json()) // Parse JSON requests

app.post(API_ROUTES.MEDIUM_AUTHORIZE, mediumAuthorize) // Request access token from the Medium API
app.get("/", (_req, res) => {
  return res.json({ message: "Hello World" })
})

// Throw error when the route is not found
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error("Route Not found");
  next(error);
});

// Return the error in the response
app.use((error: { message: string; status: number }, _req: Request, res: Response,next: NextFunction
  ) => {
    res.status(error.status || 500);
    res.json({
      status: "error",
      message: error.message
    });
    next();
  }
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
