import { Operation } from "slate"
import { ReactEditor } from "slate-react"
import { getSelectedNodes, isSelectionMultiLine } from "../../../slate-helpers"

export const withMoveNodes = (editor) => {
	const { apply } = editor

	editor.apply = (op) => {
		apply(op)

		if (Operation.isSelectionOperation(op)) {
			const [...elements] = document.getElementsByClassName("slate-node-selected")
			elements.forEach((element) => {
				element.classList.remove("slate-node-selected")
			})

			if (isSelectionMultiLine(editor)) {
				const { nodes } = getSelectedNodes(editor)

				nodes.forEach((node) => {
					const DOMNode = ReactEditor.toDOMNode(editor, node)
					DOMNode.classList.add("slate-node-selected")
				})
			}
		}
	}

	return editor
}
