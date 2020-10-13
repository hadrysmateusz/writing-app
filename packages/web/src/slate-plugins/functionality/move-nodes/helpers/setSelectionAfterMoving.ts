import { Transforms, Path, Node, Point, Editor, Range } from "slate"

import { getLastPathIndex } from "../../../../slate-helpers"

/*
  This file contains logic to get the correct selection after nodes are moved
  because slate messes it up especially in nested node trees
*/

export const setSelectionAfterMoving = (
  editor: Editor,
  from: Path[],
  to: Path,
  oldSelection: Range
) => {
  const oldPaths = from
  const isSameParent =
    Node.parent(editor, to) === Node.parent(editor, oldPaths[0])
  if (isSameParent) {
    // get paths of the moved nodes AFTER they are moved
    const newPaths = getPathsAfterMoving(oldPaths, to)
    // transform the old selection to be where the moved nodes are
    const newSelection = mapSelection(oldPaths, newPaths, oldSelection)
    // apply the new selection
    Transforms.select(editor, newSelection)
  } else {
    // TODO: handle moving nodes to a different parent (will need to handle unwrapping list-items - this might be handled in normalizing AFTER moving though)
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

const getNewPathBase = (
  oldPaths: Path[],
  newPaths: Path[],
  oldSelectionPoint: Point
) => {
  /* because getSelectedNodes returns paths at the same depth we can 
  assume the length of one path is the same as the other */
  const commonLength = oldPaths[0].length

  const index = oldPaths.findIndex((oldPath) => {
    const oldCommon = oldSelectionPoint.path.slice(0, commonLength)
    return oldPath.every((value, i) => value === oldCommon[i])
  })

  return newPaths[index]
}

const mapSelection = (oldPaths: Path[], newPaths: Path[], selection: Range) => {
  const newAnchorBase = getNewPathBase(oldPaths, newPaths, selection.anchor)
  const newFocusBase = getNewPathBase(oldPaths, newPaths, selection.focus)

  const commonLength = oldPaths[0].length

  return {
    anchor: {
      path: newAnchorBase.concat(selection.anchor.path.slice(commonLength)),
      offset: selection.anchor.offset,
    },
    focus: {
      path: newFocusBase.concat(selection.focus.path.slice(commonLength)),
      offset: selection.focus.offset,
    },
  }
}
