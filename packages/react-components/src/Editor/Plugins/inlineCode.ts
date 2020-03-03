import { ELEMENTS } from "@writing-tool/constants/src/Slate"
import { Editor, Range } from "slate"
import { Transforms } from "slate"

import { matchType } from "../helpers"

export const InlineCodePlugin = (): SlatePlugin => ({
	renderLeaf: renderLeafItalic(),
	onKeyDown: onKeyDownMark({ mark: MARK_ITALIC, hotkey }),
	deserialize: deserializeItalic()
})

export const withInlineCode = (editor) => {
	const { isInline } = editor

	// override the isInline function to mark inline code nodes as inline
	editor.isInline = (element) => {
		return element.type === ELEMENTS.CODE_INLINE ? true : isInline(element)
	}

	return editor
}

export const insertInlineCode = (editor) => {
	if (editor.selection) {
		wrapInlineCode(editor)
	}
}

export const isInlineCodeActive = (editor) => {
	const [link] = Editor.nodes(editor, { match: matchType(ELEMENTS.CODE_INLINE) })
	return !!link
}

export const unwrapInlineCode = (editor) => {
	Transforms.unwrapNodes(editor, { match: matchType(ELEMENTS.CODE_INLINE) })
}

export const wrapInlineCode = (editor) => {
	if (isInlineCodeActive(editor)) {
		unwrapInlineCode(editor)
	}
	const { selection } = editor
	const isCollapsed = selection && Range.isCollapsed(selection)

	const node = {
		type: ELEMENTS.CODE_INLINE,
		children: []
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
