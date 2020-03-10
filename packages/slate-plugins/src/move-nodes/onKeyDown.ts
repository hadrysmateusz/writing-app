import { Transforms, Path, Node, Editor, NodeEntry } from "slate"
import { ReactEditor } from "slate-react"
import {
	getSelectedNodes,
	sortPaths,
	sortNodeEntries,
	getLastPathIndex,
	isFirstChild,
	isLastChild
} from "@writing-tool/slate-helpers"

const moveNodes = (editor, from, to) => {
	Transforms.moveNodes(editor, {
		mode: "all",
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
		to: to
	})
}

export const onKeyDownMoveNodes = () => (e: KeyboardEvent, editor: ReactEditor) => {
	if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
		e.preventDefault()

		const selected = getSelectedNodes(editor, "asc")
		console.log(selected)

		const { fullPaths, nodes, parentNode, parentPath, relativePaths } = selected

		const firstPath = fullPaths[0]
		const lastPath = fullPaths[fullPaths.length - 1]

		// TODO: can't move down if selection contains a list and other block
		switch (e.key) {
			case "ArrowUp":
				if (isFirstChild(firstPath)) break
				moveNodes(editor, fullPaths, Path.previous(firstPath))
				break
			case "ArrowDown":
				if (isLastChild(editor, lastPath)) break
				moveNodes(editor, fullPaths, Path.next(lastPath))
				break
		}
	}
}
