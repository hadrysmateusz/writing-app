import { Operation, Editor } from "slate"

export const withMoveNodes = <T extends Editor>(editor: T) => {
	const { apply } = editor

	editor.apply = (op) => {
		apply(op)

		if (Operation.isSelectionOperation(op)) {
			const [...elements] = document.getElementsByClassName("slate-node-selected")
			elements.forEach((element) => {
				element.classList.remove("slate-node-selected")
			})
		}
	}

	return editor
}
