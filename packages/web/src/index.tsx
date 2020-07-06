import React from "react"
import ReactDOM from "react-dom"
import { Amplify, Auth } from "aws-amplify"

import "typeface-ibm-plex-mono"
import "typeface-open-sans"
import "typeface-poppins"

import { App } from "./Components/App"
import "./index.css"
import * as serviceWorker from "./serviceWorker"
import config from "./config"
import aws_exports from "./aws-exports"

import { loadDevTools, loadConfig } from "@writing-tool/core"

Amplify.configure(aws_exports)

console.log(Auth.currentSession()) // TODO: this is for debugging only

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
