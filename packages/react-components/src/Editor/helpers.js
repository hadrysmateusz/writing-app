import { Editor, Transforms } from "slate"

import { LIST_TYPES, BLOCKS, MARKS } from "@writing-tool/constants/src/Slate"

export const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: (n) => LIST_TYPES.includes(n.type),
		split: true
	})

	Transforms.setNodes(editor, {
		type: isActive ? BLOCKS.PARAGRAPH : isList ? BLOCKS.LIST_ITEM : format
	})

	if (!isActive && isList) {
		const block = { type: format, children: [] }
		Transforms.wrapNodes(editor, block)
	}
}

export const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		// // TODO: this logic might need to be moved into an Editor.addMark() override to make it apply in more situations
		// if (format === MARKS.CODE) {
		// 	// remove all other marks from inside of the selection first to prevent multiple code nodes being created
		// 	Object.values(MARKS).forEach((mark) => {
		// 		Editor.removeMark(editor, mark)
		// 	})
		// }

		Editor.addMark(editor, format, true)
	}
}

export const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.type === format
	})

	return !!match
}

export const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor)
	return marks ? marks[format] === true : false
}
