import React, { useState, useCallback } from "react"
import { Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import styled from "styled-components"

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

import { SuperPowers } from "./SuperPowers"
import { Toolbar } from "./Toolbar"
import { serialize, deserialize } from "./serialization"
import { useLogEditor, useLogValue } from "./devToolsUtils"
import HoveringToolbar from "./HoveringToolbar"

function loadFromLocalStorage() {
	return deserialize(localStorage.getItem("content") || "")
}

const plugins = [
	{ editorOverrides: withHistory },
	BlockquotePlugin(),
	CodeBlockPlugin(),
	HeadingsPlugin({ levels: 6 }),
	BoldPlugin({ hotkey: "mod+b" }),
	ItalicPlugin({ hotkey: "mod+i" }),
	StrikethroughPlugin({ hotkey: "mod+shift+k" }),
	LinkPlugin(),
	InlineCodePlugin(),
	LoggerPlugin(),
	{ editorOverrides: withReact }
]

const StyledEditable = styled(Editable)`
	background: #fdfdfd;
	border: 1px solid #f3f3f3;
	margin: 20px 0;
	padding: 20px;
	font-family: IBM Plex Mono;
	font-size: 16px;
`

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
		<div>
			<SuperPowers />
			<Slate editor={editor} value={value} onChange={onChange}>
				<HoveringToolbar />
				<Toolbar />
				<StyledEditable plugins={plugins} autoFocus spellCheck={false} />
			</Slate>
		</div>
	)
}

export default EditorComponent
