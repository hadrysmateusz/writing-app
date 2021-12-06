import path from "path"

import { IS_DEV } from "./helpers"

export const APP_NAME = "writing-tool" // TODO: move to shared constants file and replace all current uses

export const START_URL = IS_DEV
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "web/index.html")}`

export const filters = {
  md: { name: "Markdown", extensions: ["md"] },
  html: { name: "HTML", extensions: ["html", "htm"] },
}
