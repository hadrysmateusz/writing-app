import { Transforms, Path } from "slate"

import { ReactEditor } from "slate-react"
import { getSelectedNodes, isFirstChild, isLastChild } from "@writing-tool/slate-helpers"

import { setSelectionAfterMoving } from "./setSelectionAfterMoving"

const moveNodes = (editor, from: Path[], to: Path) => {
	// TODO: This is a temporary solution - there are still many issues with it (see below). I'm going to wait for now, maybe the issue will be fixed at some point upstream, if not I can attempt to fix it myself, or (temporarily) restrict moving nodes to a collapse selection (single line)

	const oldSelection = editor.selection

	// TODO: History is messed up after moving (when using the custom deselect/select logic)
	// Transforms.deselect(editor)

	// TODO: Moving multiple nodes when one of them breaks the selection (without the custom deselect/select logic)
	Transforms.moveNodes(editor, {
		at: oldSelection,
		to,
		match: (node) => {
			const path = ReactEditor.findPath(editor, node)
			const matches = from.some((fullPath) => {
				if (path.length === fullPath.length) {
					return fullPath.every((index, i) => path[i] === index)
				}
				return false
			})
			return matches
		},
		mode: "all"
	})

	// TODO: History is messed up after moving (when using the custom deselect/select logic)
	setSelectionAfterMoving(editor, from, to, oldSelection)
}

export const onKeyDownMoveNodes = () => (e: KeyboardEvent, editor: ReactEditor) => {
	if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
		e.preventDefault()

		if (!editor.selection) return

		const { fullPaths } = getSelectedNodes(editor, "asc")

		const firstPath = fullPaths[0]
		const lastPath = fullPaths[fullPaths.length - 1]
		let newPath

		// TODO: can't move down if selection contains a list and other block
		// TODO: selection is lost when moving down
		switch (e.key) {
			case "ArrowUp":
				if (isFirstChild(firstPath)) break
				newPath = Path.previous(firstPath)
				moveNodes(editor, fullPaths, newPath)
				break
			case "ArrowDown":
				if (isLastChild(editor, lastPath)) break
				newPath = Path.next(lastPath)
				moveNodes(editor, fullPaths, newPath)
				break
		}
	}
}
