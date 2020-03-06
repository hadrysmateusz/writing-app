import { CODE_INLINE } from "./types"

export const withInlineCode = (editor) => {
	const { isInline } = editor

	// override the isInline function to mark inline code nodes as inline
	editor.isInline = (element) => {
		const is = element.type === CODE_INLINE ? true : isInline(element)
		console.log(element.type, is)

		return is
	}

	return editor
}
