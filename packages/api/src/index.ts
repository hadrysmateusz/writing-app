// Third-Party dependencies
import express, { Application } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Local workspace dependencies
import { API_ROUTES } from "@writing-tool/shared"

// Local files
import { mediumAuthorize, userRoutes } from "./routes"
import { notFound, sendError } from "./middleware"

// Read environment variables from .env file
dotenv.config()

const PORT: any = process.env.PORT || 4000

const app: Application = express()

app.use(cors({ origin: true })) // Allow cross-origin requests
app.use(express.json()) // Parse JSON requests

app.post(API_ROUTES.MEDIUM_AUTHORIZE, mediumAuthorize) // Request access token from the Medium API

app.use("/user", userRoutes)

app.use(notFound) // Throw error when the route is not found
app.use(sendError) // Return the error in the response

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Successfully connected to database!")
  }
)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
