import { ReactEditor } from "slate-react"

import { insertDefaultBlockOnLineBreak } from "@writing-tool/slate-helpers"

import { BLOCKQUOTE } from "./types"

export const withBlockquote = <T extends ReactEditor>(editor: T) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		/* TODO: the current solution isn't perfect, when working with multi-block selections, 
		you can end up with different results after the first time a lineBreak is added and after undo+redoing.

	  Also, multi-block breaking should probably end up with the last line's formatting
	  being the only one left, and definitely with only one line left instead of two.

	  Multi-block breaking might also be difficult if I allow any plugin specify it's own line-break behavior for different element types

		I might actually want to turn any multi-block selection into a selection of top-level block wrappers like Notion
	  */

		const oldSelection = editor.selection
		insertBreak()

		insertDefaultBlockOnLineBreak(editor, oldSelection, (type) => type === BLOCKQUOTE)
	}

	return editor
}
