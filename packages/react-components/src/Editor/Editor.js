import React, { useMemo, useState, useCallback } from "react"
import { createEditor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"

import Toolbar from "./Toolbar"
import { Element } from "./Elements"
import { Leaf } from "./Leaf"
import { SuperPowers } from "./SuperPowers"
import withMarkdownShortcuts from "./withMarkdownShortcuts"
import handleHotkeys from "./handleHotkeys"
import decorate from "./decorate"
import { serialize, deserialize } from "./serialization"

import { config } from "@writing-tool/dev-tools"

const withLogger = (editor) => {
	const { apply } = editor

	editor.apply = (op) => {
		if (config.logOperations) {
			console.log(op)
		}
		apply(op)
	}

	return editor
}

function EditorComponent() {
	const renderElement = useCallback((props) => <Element {...props} />, [])
	const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
	const editor = useMemo(() => {
		return withLogger(withMarkdownShortcuts(withHistory(withReact(createEditor()))))
	}, [])
	const [value, setValue] = useState(deserialize(localStorage.getItem("content") || ""))

	if (config.logValue) {
		console.clear()
		console.log(JSON.stringify(value, null, 2))
		console.log(`Top level nodes: ${value.length}`)
	}
	if (config.logEditor) {
		console.log(editor)
	}

	const onChange = useCallback((value) => {
		setValue(value)
		localStorage.setItem("content", serialize(value))
	}, [])

	const onKeyDown = useCallback(
		(event) => {
			handleHotkeys(editor, event)
		},
		[editor]
	)

	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<Toolbar />

			<SuperPowers />

			<div style={{ fontFamily: "IBM Plex Mono", fontSize: "16px" }}>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					onKeyDown={onKeyDown}
					decorate={decorate}
				/>
			</div>
		</Slate>
	)
}

export default EditorComponent
