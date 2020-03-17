import { Editor, Transforms } from "slate"

import {
	LIST_TYPES,
	BLOCKS,
	INLINES,
	MARKS
} from "@writing-tool/common/src/constants/Slate"
import { matchType } from "@writing-tool/slate-helpers"

export const isInline = (element) => {
	const { type } = element
	return Object.values(INLINES).includes(type)
}

/**
 * Toggles the given formatting in the selection
 * works for all blocks, inlines and marks
 */
export function toggleFormat(editor, format) {
	switch (format) {
		default:
			const isMark = Object.values(MARKS).includes(format)
			const isActive = isFormatActive(editor, format)

			if (isMark) {
				if (isActive) {
					Editor.removeMark(editor, format)
				} else {
					Editor.addMark(editor, format, true)
				}
			} else {
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
	}
}

/**
 * Check if the given formatting is active in the selection
 * works for all blocks, inlines and marks
 */
export function isFormatActive(editor, format) {
	const isMark = Object.values(MARKS).includes(format)
	if (isMark) {
		const marks = Editor.marks(editor)
		return marks ? marks[format] === true : false
	} else {
		const [match] = Editor.nodes(editor, {
			match: matchType(format)
		})
		return !!match
	}
}
