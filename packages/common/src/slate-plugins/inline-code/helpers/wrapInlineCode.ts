import { Range, Transforms } from "slate"

import { CODE_INLINE } from "../types"
import { isInlineCodeActive, unwrapInlineCode } from "."

export const wrapInlineCode = (editor) => {
	if (isInlineCodeActive(editor)) {
		unwrapInlineCode(editor)
	}
	const { selection } = editor
	const isCollapsed = selection && Range.isCollapsed(selection)

	const node = {
		type: CODE_INLINE,
		children: [{ text: "" }]
	}

	if (isCollapsed) {
		// insert an empty inline code node at the cursor
		Transforms.insertNodes(editor, node)
	} else {
		// split nodes at the selection edges and wrap the selection in the inline code node
		Transforms.wrapNodes(editor, node, { split: true })
		// collapse the selection and put the cursor at the end
		Transforms.collapse(editor, { edge: "end" })
	}
}
