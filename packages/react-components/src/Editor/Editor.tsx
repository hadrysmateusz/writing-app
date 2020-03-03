import React, { useState, useCallback } from "react"
import { Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"

import { Editable, useCreateEditor } from "@writing-tool/slate-plugins-system"
import { LinkPlugin } from "@writing-tool/slate-plugins"

import Toolbar from "./Toolbar"
import { renderElement } from "./Elements"
import { renderLeaf } from "./Leafs"
import { SuperPowers } from "./SuperPowers"
import handleHotkeys from "./handleHotkeys"
import decorate from "./decorate"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "./devToolsUtils"
import HoveringToolbar from "./HoveringToolbar"
import withMarkdownShortcuts from "./Plugins/withMarkdownShortcuts"
import withOperationLogger from "./Plugins/withOperationLogger"
import { withInlineCode } from "./Plugins/inlineCode"

function loadFromLocalStorage() {
	return deserialize(localStorage.getItem("content") || "")
}

const plugins = [
	LinkPlugin(),
	{ editorOverrides: withInlineCode },
	{ editorOverrides: withHistory },
	{ editorOverrides: withOperationLogger },
	{ editorOverrides: withMarkdownShortcuts },
	{ editorOverrides: withReact }
]

function EditorComponent() {
	const [value, setValue] = useState(loadFromLocalStorage())
	const editor = useCreateEditor(plugins)

	// DevTools utils
	useLogEditor(editor)
	useLogValue(value)

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
			<HoveringToolbar />
			<Toolbar />
			<SuperPowers />
			<div style={{ fontFamily: "IBM Plex Mono", fontSize: "16px" }}>
				<Editable
					plugins={plugins}
					onKeyDown={[onKeyDown]}
					decorate={[decorate]}
					renderLeaf={[renderLeaf]}
					renderElement={[renderElement]}
					autoFocus
				/>
			</div>
		</Slate>
	)
}

export default EditorComponent
