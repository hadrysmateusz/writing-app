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
import { BlockWrapper } from "./BlockWrapper"

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
	InlineCodePlugin({ hotkey: "mod+e" }),
	LinkPlugin(),
	LoggerPlugin(),
	{ editorOverrides: withReact }
]

const EditableContainer = styled.div`
	margin: 20px 0;
	font-family: IBM Plex Mono;
	font-size: 16px;
	line-height: 24px;
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
			{/* <SuperPowers /> */}
			<Slate editor={editor} value={value} onChange={onChange}>
				<HoveringToolbar />
				<Toolbar />
				<EditableContainer>
					<Editable
						plugins={plugins}
						elementWrapper={BlockWrapper}
						autoFocus
						spellCheck={false}
					/>
				</EditableContainer>
			</Slate>
		</div>
	)
}

export default EditorComponent
