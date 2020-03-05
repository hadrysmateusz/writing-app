import { Transforms, Editor } from "slate"

export const insertDefaultBlockOnLineBreak = (editor, oldSelection, isTypeMatching) => {
	const pathToFirstNode = Editor.first(editor, oldSelection)[1]
	const firstBlock = Editor.parent(editor, pathToFirstNode)[0]

	if (firstBlock && firstBlock.type && isTypeMatching(firstBlock.type)) {
		const newSelection = editor.selection
		const { anchor: originalAnchor, focus: originalFocus } = oldSelection
		if (newSelection) {
			const startIsSelected = originalAnchor.offset === 0 || originalFocus.offset === 0
			const transformPath = [newSelection.anchor.path[0] - (startIsSelected ? 1 : 0)]
			Transforms.setNodes(editor, { type: "paragraph" }, { at: transformPath })
		}
	}
}
