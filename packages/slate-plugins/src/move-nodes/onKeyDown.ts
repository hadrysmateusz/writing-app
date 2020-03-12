import { Transforms, Path, Node, Editor, NodeEntry, Point } from "slate"
import { ReactEditor } from "slate-react"
import {
	getSelectedNodes,
	sortPaths,
	sortNodeEntries,
	getLastPathIndex,
	isFirstChild,
	isLastChild
} from "@writing-tool/slate-helpers"

const moveNodes = (editor, from: Path[], to: Path) => {
	const selection = editor.selection
	console.log("old selection", selection)

	Transforms.deselect(editor)
	Transforms.moveNodes(editor, {
		at: selection,
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

	const isSameParent = Node.parent(editor, to) === Node.parent(editor, from[0])
	if (isSameParent) {
		const numMovedElements = from.length
		const lastIndex = getLastPathIndex(to)
		const newPathBase = to.slice(0, -1)

		const newPaths = from.map((oldPath, i) => {
			if (Path.isBefore(to, from[0])) {
				// moving up
				return [...newPathBase].concat(lastIndex + i)
			} else {
				// moving down
				return [...newPathBase].concat(lastIndex + 1 - numMovedElements + i)
			}
		})

		console.log("new paths?:", newPaths)

		const newAnchorBase = getNewPathBase(from, newPaths, selection.anchor)
		const newFocusBase = getNewPathBase(from, newPaths, selection.focus)

		const commonLength = from[0].length

		console.log("anchor", selection.anchor.path.slice(0, commonLength), newAnchorBase)
		console.log("focus", selection.focus.path.slice(0, commonLength), newFocusBase)

		const newSelection = {
			anchor: {
				path: newAnchorBase.concat(selection.anchor.path.slice(commonLength)),
				offset: selection.anchor.offset
			},
			focus: {
				path: newFocusBase.concat(selection.focus.path.slice(commonLength)),
				offset: selection.focus.offset
			}
		}

		Transforms.select(editor, newSelection)

		console.log(selection, newSelection)
	}
}

export const onKeyDownMoveNodes = () => (e: KeyboardEvent, editor: ReactEditor) => {
	if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
		e.preventDefault()

		if (!editor.selection) return

		const { fullPaths, nodes, parentPath, relativePaths } = getSelectedNodes(
			editor,
			"asc"
		)

		console.log(
			"parentPath",
			parentPath,
			"fullPaths",
			fullPaths,
			"relativePaths",
			relativePaths
		)

		const firstPath = fullPaths[0]
		const lastPath = fullPaths[fullPaths.length - 1]
		let newPath

		// TODO: can't move down if selection contains a list and other block
		// TODO: selection is lost when moving down
		switch (e.key) {
			case "ArrowUp":
				if (isFirstChild(firstPath)) break
				newPath = Path.previous(firstPath)
				console.log("moving nodes:", nodes, "to path: ", newPath)
				moveNodes(editor, fullPaths, newPath)
				break
			case "ArrowDown":
				if (isLastChild(editor, lastPath)) break
				newPath = Path.next(lastPath)
				console.log("moving nodes:", nodes, "to path: ", newPath)
				moveNodes(editor, fullPaths, newPath)
				break
		}
	}
}

const getNewPathBase = (oldPaths: Path[], newPaths: Path[], oldSelectionPoint: Point) => {
	const commonLength = oldPaths[0].length

	const index = oldPaths.findIndex((oldPath) => {
		const oldCommon = oldSelectionPoint.path.slice(0, commonLength)
		return oldPath.every((value, i) => value === oldCommon[i])
	})

	return newPaths[index]
}
