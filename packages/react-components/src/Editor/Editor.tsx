import React, { useState, useCallback } from "react"
import { Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"

import { Editable, useCreateEditor } from "@writing-tool/slate-plugins-system"
import {
	InlineCodePlugin,
	LinkPlugin,
	HeadingsPlugin,
	BlockquotePlugin,
	CodeBlockPlugin,
	OperationLoggerPlugin
} from "@writing-tool/slate-plugins"

import Toolbar from "./Toolbar"
import { renderElement } from "./Elements"
import { renderLeaf } from "./Leafs"
import { SuperPowers } from "./SuperPowers"
import decorate from "./decorate"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "./devToolsUtils"
import HoveringToolbar from "./HoveringToolbar"
import { isInline } from "./helpers"
import { withBreakEmptyReset } from "./Plugins/withBreakEmptyReset"

function loadFromLocalStorage() {
	return deserialize(localStorage.getItem("content") || "")
}

const plugins = [
	LinkPlugin(),
	InlineCodePlugin(),
	BlockquotePlugin(),
	CodeBlockPlugin(),
	OperationLoggerPlugin(),
	HeadingsPlugin({ levels: 6 }),
	{ editorOverrides: withHistory },
	{
		editorOverrides: withBreakEmptyReset({
			types: [
				"blockquote",
				"code_block",
				"heading_1",
				"heading_2",
				"heading_3",
				"heading_4",
				"heading_5",
				"heading_6"
			]
		})
	},
	{ editorOverrides: withReact }
]

const InlineWrapper = ({ children }) => {
	return children
}

const BlockWrapper = ({ children }) => {
	return children
}

const ElementWrapper = ({ element, children }) => {
	const isElementInline = isInline(element)
	// TODO: there are issues with the element type probably caused by fragments or something
	const WrapperComponent = isElementInline ? InlineWrapper : BlockWrapper
	return <WrapperComponent>{children}</WrapperComponent>
}

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
					renderLeaf={[renderLeaf]}
					renderElement={[renderElement]}
					elementWrapper={ElementWrapper}
					autoFocus
					spellCheck={false}
				/>
			</div>
		</Slate>
	)
}

export default EditorComponent
