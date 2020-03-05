import React, { useState, useCallback } from "react"
import { Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"

import { Editable, useCreateEditor } from "@writing-tool/slate-plugins-system"
import {
	LoggerPlugin,
	InlineCodePlugin,
	LinkPlugin,
	HeadingsPlugin,
	BlockquotePlugin,
	CodeBlockPlugin,
	BoldPlugin,
	ItalicPlugin,
	StrikethroughPlugin
} from "@writing-tool/slate-plugins"

import Toolbar from "./Toolbar"
import { renderElement } from "./Elements"
import { SuperPowers } from "./SuperPowers"
import decorate from "./decorate"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "./devToolsUtils"
import HoveringToolbar from "./HoveringToolbar"
// import { isInline } from "./helpers"

function loadFromLocalStorage() {
	return deserialize(localStorage.getItem("content") || "")
}

const plugins = [
	{ editorOverrides: withHistory },
	LinkPlugin(),
	BlockquotePlugin(),
	CodeBlockPlugin(),
	HeadingsPlugin({ levels: 6 }),
	BoldPlugin({ hotkey: "mod+b" }),
	ItalicPlugin({ hotkey: "mod+i" }),
	StrikethroughPlugin({ hotkey: "mod+shift+k" }),
	InlineCodePlugin(),
	LoggerPlugin(),
	{ editorOverrides: withReact }
]

// const InlineWrapper = ({ children }) => {
// 	return children
// }

// const BlockWrapper = ({ children }) => {
// 	return children
// }

// const ElementWrapper = ({ element, children }) => {
// 	const isElementInline = isInline(element)
// 	// TODO: there are issues with the element type probably caused by fragments or something (only on firefox)
// 	const WrapperComponent = isElementInline ? InlineWrapper : BlockWrapper
// 	return <WrapperComponent>{children}</WrapperComponent>
// }

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

	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<HoveringToolbar />
			<Toolbar />
			<SuperPowers />
			<div style={{ fontFamily: "IBM Plex Mono", fontSize: "16px" }}>
				<Editable
					plugins={plugins}
					decorate={[decorate]}
					renderElement={[renderElement]}
					autoFocus
					spellCheck={false}
				/>
			</div>
		</Slate>
	)
}

export default EditorComponent
