import { wrapInlineCode } from "."

export const insertInlineCode = (editor) => {
	if (editor.selection) {
		wrapInlineCode(editor)
	}
}
