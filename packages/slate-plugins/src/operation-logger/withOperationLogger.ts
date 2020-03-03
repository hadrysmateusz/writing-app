import { config } from "@writing-tool/dev-tools"

export const withOperationLogger = (editor) => {
	const { apply } = editor

	editor.apply = (op) => {
		if (config.logOperations) {
			console.log(op)
		}
		apply(op)
	}

	return editor
}
