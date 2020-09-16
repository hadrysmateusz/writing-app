const routes = require("./routes")
const apiRoutes = require("./apiRoutes")
const messageTypes = require("./messageTypes")
const dndTypes = require("./dndTypes")

export const API_ROUTES = apiRoutes
export const ROUTES = routes
export const MESSAGE_TYPES = messageTypes
export const DND_TYPES = dndTypes

export const MEDIUM_API_BASE_URL = "https://api.medium.com/v1"
export const MEDIUM_API_AUTH_URL = "https://medium.com/m/oauth/authorize"
export const HOSTING_URL = "https://write-and-publish.netlify.com"
export const API_BASE_URL = "localhost:4000"
export const MEDIUM_CLIENT_ID = "faa8741a7dd9"
export const GROUP_TREE_ROOT = "group_tree_root"
