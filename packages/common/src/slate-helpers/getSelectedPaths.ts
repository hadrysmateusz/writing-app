import { Editor, Element, Path, Node, NodeEntry } from "slate"
import { sortPaths } from "./sortPaths"

// Simplified version of getSelectedNodes

// TODO: make sure there are no duplicates in the result
export const getSelectedPaths = (editor: Editor, direction: "asc" | "desc" = "asc"): Path[] => {
  // TODO: better handle this scenario
  if (!editor.selection) return []

	// narrow down the selection
  const [...nodeEntries] = Editor.nodes(editor, {
    mode: "lowest",
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && !editor.isInline(n)
  })

  // if there are no nodes there will be no commonPath paths
  if (nodeEntries.length === 0) return []

  // PERF: if there is only one NodeEntry, there will only be one path
  if (nodeEntries.length === 1) {
    const [, path] = nodeEntries[0] // nodeEntries is an array of tuples ([Node,Path]) and we only need the path
    const parentPath = Path.parent(path)
    // if the node is an only child, its parent should be returned instead (if it's not the editor)
    return shouldRoundSelection(editor, parentPath, 1) ? [parentPath] : [path]
  }

  const paths = getCommonPaths(editor, nodeEntries, [], 0)

  return sortPaths(paths, direction)
}

/**
 * Get the common path as well as relative and parent path for arbitrary NodeEntries
 *
 * @param editor editor object (might want to replace it with a generic 'root' param)
 * @param nodeEntries nodeEntries to get the paths from
 * @param commonPath current common path (necessary because of the recursive nature of this function)
 * @param index current index to compare (necessary because of the recursive nature of this function)
 */
const getCommonPaths = (
  editor: Editor,
  nodeEntries: NodeEntry<Node>[],
  commonPath: Path,
  index: number
): Path[] => {
  const values = getUniqueValues(nodeEntries, index)
  const numUnique = values.length

  // this should never happen but it's here just in case
  if (numUnique === 0) {
    throw new Error("Unexpected scenario, nodeEntries might have been duplicated")
  }

  // if there is only one unique value it means that we are still in the common part and we need to move further
  if (numUnique === 1) {
    return getCommonPaths(editor, nodeEntries, [...commonPath, values[0]], index + 1)
  }

  // if all children of the parent node are selected return the parent, else return all selected child nodes
  return shouldRoundSelection(editor, commonPath, numUnique)
    ? [commonPath]
    : values.map((value) => [...commonPath, value])
}

const getUniqueValues = (nodeEntries: NodeEntry[], index: number): number[] => {
  // we use a Set because we only need unique values
  const set = new Set<number>()
  nodeEntries.forEach(([, path]) => {
    // not all paths have to be of the same length so we need to check for undefined values
    if (path[index] !== undefined) {
      set.add(path[index])
    }
  })

  // we create an array from the Set to access the values in it
  return Array.from(set)
}

const shouldRoundSelection = (editor: Editor, commonPath: Path, numSelected: number) => {
  const commonNode = Node.get(editor, commonPath)
  // if the commonNode is the editor, don't round
  if (Editor.isEditor(commonNode)) return false
  // get the number of children the parent node has
  const numChildren: number | undefined = commonNode?.children?.length
  // if the commonNode doesn't have a correct children property, don't round
  if (numChildren === undefined) return false
  // if the number of selected nodes matches the number of the commonNode's children, round the selection
  return numChildren === numSelected
}
