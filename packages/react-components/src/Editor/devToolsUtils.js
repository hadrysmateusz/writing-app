import { useEffect } from "react"
import { cloneDeep } from "lodash"

import {
	config,
	addDevToolsEventHandler,
	removeDevToolsEventHandler
} from "@writing-tool/dev-tools"

export const useLogValue = (value) => {
	useEffect(() => {
		if (config.logValue) {
			console.clear()
			console.log(JSON.stringify(value, null, 2))
			console.log(`Top level nodes: ${value.length}`)
		}
	}, [value])
}

export const useLogEditor = (editor) => {
	useEffect(() => {
		const logEditor = () => {
			console.dir(cloneDeep(editor))
		}
		addDevToolsEventHandler("logEditor", logEditor)
		return removeDevToolsEventHandler("logEditor", logEditor)
	}, [editor])
}
