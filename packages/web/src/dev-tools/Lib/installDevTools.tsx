import React from "react"
import ReactDOM from "react-dom"

import { DevToolsMenu } from "../Components"

declare global {
  interface Window {
    devToolsEnabled: boolean
  }
}

// function getLocalDevTools() {
//   const requireDevToolsLocal = require.context(
//     "./",
//     false,
//     /dev-tools\.local\.js/
//   )
//   const local = requireDevToolsLocal.keys()[0]
//   if (local) {
//     return requireDevToolsLocal(local).default
//   } else {
//     return () => null
//   }
// }

export function install() {
  window.devToolsEnabled = true
  // create new root element for dev tools
  const devToolsRoot = document.createElement("div")
  // get local dev tools if they exist
  // const LocalDevTools = getLocalDevTools()
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(
    <DevToolsMenu local={/* <LocalDevTools /> */ null} />,
    devToolsRoot
  )
}
