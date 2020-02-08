const routes = require("./routes")
const apiRoutes = require("./apiRoutes")
const messageTypes = require("./messageTypes")

module.exports.API_ROUTES = apiRoutes
module.exports.ROUTES = routes
module.exports.MESSAGE_TYPES = messageTypes
module.exports.MEDIUM_API_BASE_URL = "https://api.medium.com/v1"
module.exports.MEDIUM_API_AUTH_URL = "https://medium.com/m/oauth/authorize"
module.exports.HOSTING_URL = "https://write-and-publish-tool.firebaseapp.com"
module.exports.CLOUD_FUNCTIONS_BASE_URL = "https://us-central1-write-and-publish-tool.cloudfunctions.net"
module.exports.MEDIUM_CLIENT_ID = "faa8741a7dd9"
