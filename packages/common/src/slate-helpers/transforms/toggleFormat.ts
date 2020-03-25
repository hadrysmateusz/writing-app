import { Editor, Transforms } from "slate"

import {
	LIST_TYPES,
	BLOCKS,
	MARKS
} from "@writing-tool/common/src/constants/Slate"
import { isFormatActive } from "../queries"

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
