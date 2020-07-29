import { Editor, Path, Node, NodeEntry, Range, Location, Point } from "slate"
import { sortPaths } from "./sortPaths"
import isBlockNode from "./isBlockNode"
import { isAncestor } from "./queries"

// TODO: see if it's possible to implement it by iterating over paths backwards, checking if the indexes are the same until they aren't or you reach 0 and then slicing the path to end at the point they are different, adding them to a set and converting back to array to get rid of duplicates (all rounding operations should be done at the end)

/**
 * Get the most nested parent of all nodes (or multiple nodes at the same level)
 *
 * TODO: make sure there are no duplicates in the result
 * TODO: the results when a child of list item which has a sublist is selected are unintuitive - consider making the algorithm more lists-aware
 *
 * @param editor editor object (I might want to replace it with a generic 'root' param)
 * @param direction direction to sort the resulting nodes in
 */
const getCommonNodes = (
  editor: Editor,
  options: {
    at?: Location
    direction?: "asc" | "desc"
    roundSelection?: boolean
  } = {}
): NodeEntry[] => {
  const {
    at = editor.selection,
    direction = "asc",
    roundSelection = true,
  } = options

  if (at === null) return []

  // if `at` isn't a range get the single selected node
  if (!Range.isRange(at) || Range.isCollapsed(at)) {
    let path: Path

    if (Range.isRange(at)) {
      path = at.anchor.path
    } else if (Point.isPoint(at)) {
      path = at.path
    } else {
      path = at
    }

    let nodeEntry = Editor.node(editor, path)
    if (!isAncestor(nodeEntry[0])) {
      nodeEntry = Editor.parent(editor, path)
    }

    // TODO: consider if this might be different for some edge cases involving nesting, lists and list items
    return [nodeEntry]
  }

  // get all deepest nodes in the range
  const [...deepestNodes] = Editor.nodes(editor, {
    at: at,
    mode: "lowest",
    match: (n) => isBlockNode(editor, n),
  })

  const commonPaths = getCommonPaths(editor, deepestNodes, roundSelection)
  const sortedPaths = sortPaths(commonPaths, direction)
  const nodeEntries = sortedPaths.map<NodeEntry>((path) => [
    Node.get(editor, path),
    path,
  ])

  return nodeEntries
}

/**
 * Get the most nested parent of all paths (or multiple paths at the same level)
 *
 * @param editor editor object (I might want to replace it with a generic 'root' param)
 * @param nodeEntries an array of NodeEntries to get the paths from
 */
const getCommonPaths = (
  editor: Editor,
  nodeEntries: NodeEntry<Node>[],
  roundSelection: boolean
): Path[] => {
  // if there are no nodes there will be no commonPath paths
  if (nodeEntries.length === 0) return []

  // if there is only one NodeEntry, there will only be one path
  if (nodeEntries.length === 1) {
    const [, path] = nodeEntries[0] // nodeEntries is an array of tuples ([Node,Path]) and we only need the path
    const [parentNode, parentPath] = Editor.parent(editor, path)
    const numChildren = parentNode.children.length

    // if the node is an only child, its parent should be returned instead (if it's not the editor)
    return numChildren === 1 && !Editor.isEditor(parentNode) && roundSelection
      ? [parentPath]
      : [path]
  }

  return innerGetCommonPaths(editor, nodeEntries, roundSelection, [], 0)
}

/**
 * The recursive portion of getCommonPaths
 *
 * @param editor editor object (I might want to replace it with a generic 'root' param)
 * @param nodeEntries an array of NodeEntries to get the paths from
 * @param commonPath current common path (necessary because of the recursive nature of this function)
 * @param index current index to compare (necessary because of the recursive nature of this function)
 */
const innerGetCommonPaths = (
  editor: Editor,
  nodeEntries: NodeEntry<Node>[],
  roundSelection: boolean,
  commonPath: Path,
  index: number
): Path[] => {
  const indexes = getUniqueIndexes(nodeEntries, index)
  const numUnique = indexes.length

  // if there is only one unique value it means that we are still in the common part of the path and we need to move further
  if (numUnique === 1) {
    return innerGetCommonPaths(
      editor,
      nodeEntries,
      roundSelection,
      [...commonPath, indexes[0]],
      index + 1
    )
  }

  if (roundSelection) {
    // check if all children of the parent are selected
    const commonNode = Node.get(editor, commonPath)
    const [...children] = Node.children(editor, commonPath)
    const numChildren = children.length
    const allChildrenSelected = numChildren === numUnique

    // if all children of the parent node are selected and the commonPart is not the editor, round the selection to the parent
    if (allChildrenSelected && !Editor.isEditor(commonNode)) return [commonPath]
  }

  // create a list of paths from the current commonPath and every unique index found
  return indexes.map<Path>((index) => [...commonPath, index])
}

/**
 * Iterate over a level of indexes in a group of paths (extracted from nodeEntries)
 * @param nodeEntries an array of NodeEntries to get the paths from
 * @param level the level of indexes to be checked
 */
const getUniqueIndexes = (
  nodeEntries: NodeEntry[],
  level: number
): number[] => {
  // we use a Set because we only need unique values
  const set = new Set<number>()
  nodeEntries.forEach(([, path]) => {
    // not all paths have to be of the same length so we need to check for undefined values
    if (path[level] !== undefined) {
      set.add(path[level])
    }
  })

  // we create an array from the Set to access the values in it
  const values = Array.from(set)

  if (values.length === 0) {
    // TODO: check for duplicates first to eliminate this
    throw Error("Unexpected scenario, nodeEntries might have been duplicated")
  }

  return values
}

export default getCommonNodes
