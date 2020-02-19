import React from "react"
import ReactDOM from "react-dom"

import "./dev-tools.css"
import FeatureToggles from "../Components/FeatureToggles"

function getLocalDevTools() {
	const requireDevToolsLocal = require.context("./", false, /dev-tools\.local\.js/)
	const local = requireDevToolsLocal.keys()[0]
	if (local) {
		return requireDevToolsLocal(local).default
	} else {
		return () => null
	}
}

function install() {
	window.devToolsEnabled = true
	// get load local dev tools if it's there
	const LocalDevTools = getLocalDevTools()

	function DevTools() {
		return (
			<div id="dev-tools">
				<div>🛠</div>
				<div className="tools">
					<LocalDevTools />
					<FeatureToggles />
				</div>
			</div>
		)
	}

	// add dev tools UI to the page
	const devToolsRoot = document.createElement("div")
	document.body.appendChild(devToolsRoot)
	ReactDOM.render(<DevTools />, devToolsRoot)
}

export { install }
