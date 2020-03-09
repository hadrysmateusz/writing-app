import { Editor, Element, Path, Node, NodeEntry } from "slate"

export const getSelectedNodes = (editor): NodeEntry[] => {
	const [...nodes] = Editor.nodes(editor, {
		mode: "lowest",
		match: (n) => !Editor.isEditor(n) && Element.isElement(n) && !editor.isInline(n)
	})

	if (!editor.selection) {
		console.warn("attempted to move nodes without a selection")
		return []
	}

	const commonPaths = getCommonPaths(editor, nodes, [], 0)
	return commonPaths.map((path) => {
		const node = Node.get(editor, path)
		return [node, path]
	})
}

const getCommonPaths = (
	editor,
	nodeEntries: NodeEntry<Node>[],
	commonPath: Path,
	index: number
): Path[] => {
	// if there are no nodes there will be no commonPath paths
	if (nodeEntries.length === 0) {
		console.log("no node entries. returning empty...")
		return []
	}

	// if there is only one node, there will only be one path
	if (nodeEntries.length === 1) {
		console.log("there is only one node...")
		// nodeEntries is an array of tuples ([Node,Path]) and we only need the path
		const [, path] = nodeEntries[0]
		const parent = Node.parent(editor, path)
		const numChildren = parent.children.length
		if (numChildren === 1) {
			console.log("it's the parent's only, child. returning parent...")
			return [Path.parent(path)]
		} else {
			console.log("parent has multiple children. returning child...")
			return [path]
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

		const [...children] = Node.children(editor, commonPath)
		const numChildren = children.length
		const commonMsg = `${numSelected}/${numChildren} of the common parent's children are selected.`
		const allChildrenSelected = numChildren === numSelected

		if (allChildrenSelected) {
			// if all of the common parent's children are selected we should treat it as a selection on the parent itself
			console.log(`${commonMsg} returning parent...`)
			return [commonPath]
		} else {
			// if there were many unique values it means that the common part is over and we can return the paths
			// we construct the paths by concatenating the common part with all unique values
			console.log(`${commonMsg} returning children...`)
			return values.map((value) => [...commonPath, value])
		}
	} else if (numSelected === 0) {
		// if there was no values at all, it probably means that the nodeEntries were duplicated and we should treat the common part as the only common path
		console.warn("unusual scenario, returning common part")
		return [commonPath]
	} else {
		// if there was only one unique value it means that we are still in the common part and we need to move further
		return getCommonPaths(editor, nodeEntries, [...commonPath, values[0]], index + 1)
	}
}
