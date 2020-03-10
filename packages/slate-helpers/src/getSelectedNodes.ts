import { Editor, Element, Path, Node, NodeEntry } from "slate"

export const getLastPathIndex = (path) => path[path.length - 1]

export const getSelectedNodes = (
	editor
): {
	parentPath: Path
	relativePaths: number[]
	fullPaths: Path[]
	nodes: Node[]
	parentNode: Node
} => {
	const [...nodes] = Editor.nodes(editor, {
		mode: "lowest",
		match: (n) => !Editor.isEditor(n) && Element.isElement(n) && !editor.isInline(n)
	})

	if (!editor.selection) {
		console.warn("attempted to move nodes without a selection")
		return {
			parentPath: null,
			relativePaths: null,
			fullPaths: [],
			nodes: [],
			parentNode: null
		}
	}

	const { parentPath, relativePaths, fullPaths } = getCommonPaths(editor, nodes, [], 0)
	return {
		parentPath,
		relativePaths,
		fullPaths,
		parentNode: Node.get(editor, parentPath),
		nodes: fullPaths.map((path) => Node.get(editor, path))
	}
}

const getCommonPaths = (
	editor,
	nodeEntries: NodeEntry<Node>[],
	commonPath: Path,
	index: number
): { parentPath: Path; relativePaths: number[]; fullPaths: Path[] } => {
	// if there are no nodes there will be no commonPath paths
	if (nodeEntries.length === 0) {
		console.log("no node entries. returning empty...")
		return { parentPath: null, relativePaths: null, fullPaths: [] }
	}

	// if there is only one NodeEntry, there will only be one path
	if (nodeEntries.length === 1) {
		const [, path] = nodeEntries[0] // nodeEntries is an array of tuples ([Node,Path]) and we only need the path
		const parentPath = Path.parent(path)
		const parentNode = Node.get(editor, parentPath)
		const numChildren = parentNode.children.length

		// if the node is an only child, it's parent should be returned instead (if it's not the editor)
		if (numChildren === 1 && !Editor.isEditor(parentNode)) {
			console.log("rounding the selection to parent...")
			return {
				parentPath: Path.parent(parentPath),
				relativePaths: [getLastPathIndex(parentPath)],
				fullPaths: [parentPath]
			}
		} else {
			return {
				parentPath: parentPath,
				relativePaths: [getLastPathIndex(path)],
				fullPaths: [path]
			}
		}
	}

	// we use a Set because we only need unique values
	const set = new Set<number>()
	nodeEntries.forEach(([, path]) => {
		// not all paths have to be of the same length so we need to check for undefined values
		if (path[index] !== undefined) {
			set.add(path[index])
		}
	})

	// we create an array from the Set to access the values in it
	const values = Array.from(set)
	const numSelected = values.length

	if (numSelected > 1) {
		// if there were many unique values it means that the common part is over

		// if the common node is the editor, return the children
		const commonNode = Node.get(editor, commonPath)
		if (Editor.isEditor(commonNode)) {
			const fullPaths = values.map((value) => [...commonPath, value])
			return { parentPath: commonPath, relativePaths: values, fullPaths: fullPaths }
		}

		const [...children] = Node.children(editor, commonPath)
		const numChildren = children.length
		const commonMsg = `${numSelected}/${numChildren} of the common parent's children are selected.`
		const allChildrenSelected = numChildren === numSelected
		const parentPath = Path.parent(commonPath)
		const parentNode = Node.get(editor, parentPath)

		if (allChildrenSelected && !Editor.isEditor(parentNode)) {
			// if all of the common parent's children are selected we should treat it as a selection on the parent itself
			console.log(`${commonMsg} returning parent...`)
			return {
				parentPath: Path.parent(commonPath),
				relativePaths: [0],
				fullPaths: [commonPath]
			}
		} else {
			// if there were many unique values it means that the common part is over and we can return the paths
			// we construct the paths by concatenating the common part with all unique values
			console.log(`${commonMsg} returning children...`)
			const fullPaths = values.map((value) => [...commonPath, value])
			return { parentPath: commonPath, relativePaths: values, fullPaths: fullPaths }
		}
	} else if (numSelected === 0) {
		// if there was no values at all, it probably means that the nodeEntries were duplicated and we should treat the common part as the only common path
		console.warn("unusual scenario, returning common part")
		return {
			parentPath: Path.parent(commonPath),
			relativePaths: [0],
			fullPaths: [commonPath]
		}
	} else {
		// if there was only one unique value it means that we are still in the common part and we need to move further
		return getCommonPaths(editor, nodeEntries, [...commonPath, values[0]], index + 1)
	}
}
