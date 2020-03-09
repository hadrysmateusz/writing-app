import { config } from "@writing-tool/dev-tools"
import { Operation, Editor } from "slate"

export const withLogger = <T extends Editor>(editor: T) => {
	const { apply } = editor

	editor.apply = (op) => {
		if (config.logSelection || config.logOperations) {
			// console.clear()
		}

		// ------------ OPERATIONS ------------
		if (config.logOperations) {
			console.log(op)
		}

		apply(op)

		// ------------ SELECTION ------------
		// selection is logged after the operation to reflect the newest changes
		if (config.logSelection && Operation.isSelectionOperation(op)) {
			if (editor.selection) {
				const { anchor, focus } = editor.selection
				console.log(
					`ANCHOR: ${JSON.stringify(anchor.path)} +${
						anchor.offset
					} FOCUS: ${JSON.stringify(focus.path)} +${focus.offset}`
				)
			} else {
				console.log("selection is null")
			}
		}
	}

	return editor
}
