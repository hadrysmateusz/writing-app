import React, { useMemo, useState, useCallback } from "react"
import { createEditor, Node, Text, Range, Editor, Transforms, Point } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import { withHistory } from "slate-history"
import isHotkey from "is-hotkey"

import { toggleMark } from "@writing-tool/helpers"

import Toolbar from "./Toolbar"
import { Element } from "./Elements"
import { Leaf } from "./Leaf"
import { SuperPowers } from "./SuperPowers"

import Prism from "../prism"

const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+`": "code"
}

const SHORTCUTS = {
	"*": "list-item",
	"-": "list-item",
	"+": "list-item",
	">": "block-quote",
	"#": "heading1",
	"##": "heading2",
	"###": "heading3",
	"####": "heading4",
	"#####": "heading5",
	"######": "heading6"
}

const serialize = (value) => {
	return value.map((n) => Node.string(n)).join("\n")
}

const deserialize = (string) => {
	// Return a value array of children derived by splitting the string
	return string.split("\n").map((line) => {
		return { children: [{ text: line }] }
	})
}

function EditorComponent() {
	const renderElement = useCallback((props) => <Element {...props} />, [])
	const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
	const editor = useMemo(() => withShortcuts(withHistory(withReact(createEditor()))), [])
	const [value, setValue] = useState(deserialize(localStorage.getItem("content") || ""))

	const onKeyDown = useCallback(
		(event) => {
			for (const hotkey in HOTKEYS) {
				if (isHotkey(hotkey, event)) {
					event.preventDefault()
					const mark = HOTKEYS[hotkey]
					toggleMark(editor, mark)
				}
			}
		},
		[editor]
	)

	const onChange = useCallback((value) => {
		setValue(value)
		localStorage.setItem("content", serialize(value))
	}, [])

	const decorate = useCallback(([node, path]) => {
		const ranges = []

		if (!Text.isText(node)) {
			return ranges
		}

		const getLength = (token) => {
			if (typeof token === "string") {
				return token.length
			} else if (typeof token.content === "string") {
				return token.content.length
			} else {
				return token.content.reduce((l, t) => l + getLength(t), 0)
			}
		}

		const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
		let start = 0

		for (const token of tokens) {
			const length = getLength(token)
			const end = start + length

			if (typeof token !== "string") {
				ranges.push({
					[token.type]: true,
					anchor: { path, offset: start },
					focus: { path, offset: end }
				})
			}

			start = end
		}

		return ranges
	}, [])

	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<Toolbar />

			<SuperPowers>Publish</SuperPowers>

			<div style={{ fontFamily: "IBM Plex Mono", fontSize: "16px" }}>
				<Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={onKeyDown} decorate={decorate} />
			</div>
		</Slate>
	)
}

const withShortcuts = (editor) => {
	const { deleteBackward, insertText } = editor

	editor.insertText = (text) => {
		const { selection } = editor

		/* When pressing 'space', check if the text before it matches a markdown shortcut. 
		If so, change the node type */
		if (text === " " && selection && Range.isCollapsed(selection)) {
			const { anchor } = selection
			const block = Editor.above(editor, {
				match: (node) => Editor.isBlock(editor, node)
			})
			const path = block ? block[1] : []
			const start = Editor.start(editor, path)
			const range = { anchor, focus: start }
			const beforeText = Editor.string(editor, range)
			const type = SHORTCUTS[beforeText]

			if (type) {
				Transforms.select(editor, range)
				Transforms.delete(editor)
				Transforms.setNodes(editor, { type }, { match: (node) => Editor.isBlock(editor, node) })

				if (type === "list-item") {
					const list = { type: "bulleted-list", children: [] }
					Transforms.wrapNodes(editor, list, {
						match: (node) => node.type === "list-item"
					})
				}

				return
			}
		}

		insertText(text)
	}

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const match = Editor.above(editor, {
				match: (node) => Editor.isBlock(editor, node)
			})

			if (match) {
				const [block, path] = match
				const start = Editor.start(editor, path)

				if (block.type !== "paragraph" && Point.equals(selection.anchor, start)) {
					Transforms.setNodes(editor, { type: "paragraph" })

					if (block.type === "list-item") {
						Transforms.unwrapNodes(editor, {
							match: (node) => node.type === "bulleted-list"
						})
					}
				}

				return
			}
		}

		deleteBackward(...args)
	}

	return editor
}

export default EditorComponent
