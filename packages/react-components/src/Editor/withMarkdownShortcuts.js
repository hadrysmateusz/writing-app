import { Range, Editor, Transforms, Point } from "slate"

import { BLOCKS } from "@writing-tool/constants/src/Slate"

const SHORTCUTS = {
	"*": [BLOCKS.LIST_ITEM],
	"-": [BLOCKS.LIST_ITEM],
	"+": [BLOCKS.LIST_ITEM],
	">": [BLOCKS.BLOCKQUOTE],
	"#": [BLOCKS.HEADING_1],
	"##": [BLOCKS.HEADING_2],
	"###": [BLOCKS.HEADING_3],
	"####": [BLOCKS.HEADING_4],
	"#####": [BLOCKS.HEADING_5],
	"######": [BLOCKS.HEADING_6]
}

export default (editor) => {
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
				Transforms.setNodes(
					editor,
					{ type },
					{ match: (node) => Editor.isBlock(editor, node) }
				)
				// TODO: add shortcut and handling for numbered lists
				if (type === BLOCKS.LIST_ITEM) {
					const list = { type: BLOCKS.LIST_BULLETED, children: [] }
					Transforms.wrapNodes(editor, list, {
						match: (node) => node.type === BLOCKS.LIST_ITEM
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

				if (block.type !== BLOCKS.PARAGRAPH && Point.equals(selection.anchor, start)) {
					Transforms.setNodes(editor, { type: BLOCKS.PARAGRAPH })

					if (block.type === BLOCKS.LIST_ITEM) {
						Transforms.unwrapNodes(editor, {
							match: (node) => node.type === BLOCKS.LIST_BULLETED
						})
					}

					return
				}
			}
			deleteBackward(...args)
		}
	}

	return editor
}
