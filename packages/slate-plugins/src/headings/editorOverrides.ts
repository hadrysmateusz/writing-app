import { ReactEditor } from "slate-react"

import { insertDefaultBlockOnLineBreak } from "@writing-tool/slate-helpers"

export const withHeadings = <T extends ReactEditor>(editor: T) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		/* TODO: the current solution isn't perfect, when working with multi-block selections, 
		you can end up with different results after the first time a lineBreak is added and after undo+redoing.

	  Also, multi-block breaking should probably end up with the last line's formatting
	  being the only one left, and definitely with only one line left instead of two.

	  Multi-block breaking might also be difficult if I allow any plugin specify it's own line-break behavior for different element types

		I might actually want to turn any multi-block selection into a selection of top-level block wrappers like Notion

		There is also an issue where if the selection ends on an empty block element, the portion of text left before the start of the selection in its top-most element will lose its formatting which will be moved to the element below
	  */

		const oldSelection = editor.selection
		insertBreak()

		insertDefaultBlockOnLineBreak(editor, oldSelection, (type) =>
			type.startsWith("heading")
		)
	}

	return editor
}
