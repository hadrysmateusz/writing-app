import { Editor } from "slate"

import {MARKS} from "@writing-tool/common/src/constants/Slate"
import { matchType } from "../../slate-helpers"

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
