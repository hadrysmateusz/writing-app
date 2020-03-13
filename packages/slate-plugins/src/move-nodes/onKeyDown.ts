import { Transforms, Path, Node, Point } from "slate"

import { ReactEditor } from "slate-react"
import {
	getSelectedNodes,
	getLastPathIndex,
	isFirstChild,
	isLastChild
} from "@writing-tool/slate-helpers"

const moveNodes = (editor, from: Path[], to: Path) => {
	// TODO: This is a temporary solution - there are still many issues with it (see below). I'm going to wait for now, maybe the issue will be fixed at some point upstream, if not I can attempt to fix it myself, or (temporarily) restrict moving nodes to a collapse selection (single line)

	const oldSelection = editor.selection
	Transforms.deselect(editor)

	// TODO: History is messed up after moving (when using the custom deselect/select logic)
	// TODO: Moving multiple nodes when one of them is a list is broken (without the custom deselect/select logic)
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

	const oldPaths = from
	const isSameParent = Node.parent(editor, to) === Node.parent(editor, oldPaths[0])
	if (isSameParent) {
		const newPaths = getPathsAfterMoving(oldPaths, to)
		const newSelection = mapSelection(oldPaths, newPaths, oldSelection)
		Transforms.select(editor, newSelection)
	} else {
		// TODO: handle moving from nodes to a different parent (will need to handle unwrapping list-items - this might be handled in normalizing AFTER moving though)
	}
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

const getPathsAfterMoving = (oldPaths: Path[], moveTarget: Path) => {
	const numMovedElements = oldPaths.length
	const lastIndex = getLastPathIndex(moveTarget)
	const newPathBase = moveTarget.slice(0, -1)

	return oldPaths.map((_, i) => {
		// moving up and down needs different logic to account for the displacement of the moved nodes
		if (Path.isBefore(moveTarget, oldPaths[0])) {
			return [...newPathBase].concat(lastIndex + i) // moving up
		} else {
			return [...newPathBase].concat(lastIndex + 1 - numMovedElements + i) // moving down
		}
	})
}

const getNewPathBase = (oldPaths: Path[], newPaths: Path[], oldSelectionPoint: Point) => {
	const commonLength = oldPaths[0].length

	const index = oldPaths.findIndex((oldPath) => {
		const oldCommon = oldSelectionPoint.path.slice(0, commonLength)
		return oldPath.every((value, i) => value === oldCommon[i])
	})

	return newPaths[index]
}

const mapSelection = (oldPaths, newPaths, selection) => {
	const newAnchorBase = getNewPathBase(oldPaths, newPaths, selection.anchor)
	const newFocusBase = getNewPathBase(oldPaths, newPaths, selection.focus)

	const commonLength = oldPaths[0].length

	return {
		anchor: {
			path: newAnchorBase.concat(selection.anchor.path.slice(commonLength)),
			offset: selection.anchor.offset
		},
		focus: {
			path: newFocusBase.concat(selection.focus.path.slice(commonLength)),
			offset: selection.focus.offset
		}
	}
}
