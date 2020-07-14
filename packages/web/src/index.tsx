import React from "react"
import ReactDOM from "react-dom"
import { Amplify } from "aws-amplify"

import "typeface-ibm-plex-mono"
import "typeface-open-sans"
import "typeface-poppins"

import { loadDevTools, loadConfig, App } from "@writing-tool/core"

import "./index.css"
import * as serviceWorker from "./serviceWorker"
import config from "./config"

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:b43ad165-df33-434c-a243-d204feb25d31",
    region: "us-east-1",
    userPoolId: "us-east-1_U9vIjaJBz",
    userPoolWebClientId: "n2cs9p5s667sck722q74nieq9",
    mandatorySignIn: true,
  },
})

// load and install the dev tools (if they need to be)
// and when that's done, let's render the app
// NOTE: if we don't need to install the devtools, then the callback
// is called synchronously so there's no penalty for including this
// in production.
loadConfig(config, () =>
  loadDevTools(() => {
    ReactDOM.render(<App />, document.getElementById("root"))
  })
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
