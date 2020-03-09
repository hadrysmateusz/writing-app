import { Operation, Editor, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { getSelectedNodes } from "@writing-tool/slate-helpers"

export const withMoveNodes = (editor) => {
	const { apply } = editor

	editor.apply = (op) => {
		apply(op)

		// if (Operation.isSelectionOperation(op)) {
		// 	const [...elements] = document.getElementsByClassName("slate-node-selected")
		// 	elements.forEach((element) => {
		// 		element.classList.remove("slate-node-selected")
		// 	})

		// 	const entries = getSelectedNodes(editor)

		// 	// const firstPath = entries[0][1]
		// 	// const lastPath = entries[entries.length - 1][1]
		// 	// const start = Editor.start(editor, firstPath)
		// 	// const end = Editor.end(editor, lastPath)
		// 	// Transforms.setSelection(editor, { anchor: start, focus: end })

		// 	entries.forEach(([node, path]) => {
		// 		const DOMNode = ReactEditor.toDOMNode(editor, node)
		// 		DOMNode.classList.add("slate-node-selected")
		// 	})
		// }
	}

	return editor
}
