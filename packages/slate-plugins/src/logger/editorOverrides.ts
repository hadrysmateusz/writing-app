import { config } from "@writing-tool/dev-tools"

export const withSelectionLogger = (editor) => {
	const { apply } = editor

	editor.apply = (op) => {
		if (config.logSelection || config.logOperations) {
			// console.clear()
		}

		// ------------ SELECTION ------------
		if (config.logSelection) {
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

		// ------------ OPERATIONS ------------
		if (config.logOperations) {
			console.log(op)
		}

		apply(op)
	}

	return editor
}
