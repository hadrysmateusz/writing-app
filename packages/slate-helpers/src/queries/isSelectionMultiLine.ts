import { Path } from "slate"

export const isSelectionMultiLine = (editor) => {
	const { selection } = editor
	if (!selection) return false
	return !Path.equals(selection.anchor.path, selection.focus.path)
}
