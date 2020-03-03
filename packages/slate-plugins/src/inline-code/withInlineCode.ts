import { CODE_INLINE } from "./types"

export const withInlineCode = (editor) => {
	const { isInline } = editor

	// override the isInline function to mark inline code nodes as inline
	editor.isInline = (element) => {
		return element.type === CODE_INLINE ? true : isInline(element)
	}

	return editor
}
