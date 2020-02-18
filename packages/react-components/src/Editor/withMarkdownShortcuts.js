import { Range, Editor, Transforms, Point } from "slate"

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

					return
				}
			}
			deleteBackward(...args)
		}
	}

	return editor
}
