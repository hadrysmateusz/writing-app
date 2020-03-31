import { Editor, Transforms, Node, Path } from "slate"
import { EditorOverrides } from "@slate-plugin-system/core"
import { OnBreakSetDefaultOptions } from "./types"
import { isSelectionMultiLine, getSelectedPaths } from "../../../slate-helpers"

/**
 * Improve line break behavior by making it more intuitive
 *
 * It will set the node selected after the line break to the default
 * type and in case of multi-block selections: preserve the last node's type
 */
export const withOnBreakSetDefault = (
  options: OnBreakSetDefaultOptions
): EditorOverrides => (editor) => {
  const { insertBreak } = editor
  const { defaultType = "paragraph" } = options

  editor.insertBreak = () => {
    const oldSelection = editor.selection
    if (!oldSelection) return

    if (isSelectionMultiLine(editor)) {
      // get all required values before inserting the line break
      const paths = getSelectedPaths(editor)
      const firstPath = Path.next(paths[0])
      const lastPath = paths[paths.length - 1]
      const lastPathRef = Editor.pathRef(editor, lastPath)
      const lastNode = Node.get(editor, lastPath)
      const lastNodeType = lastNode?.type
      const newNode = { type: defaultType, children: [{ text: "" }] }

      // insert line break
      insertBreak()

      // insert new empty node after the first block
      Transforms.insertNodes(editor, newNode, { at: firstPath, select: true })

      // make sure the reference is still correct
      if (!lastPathRef.current) {
        throw new Error("reference to last node's path was lost")
      }

      // set type of last node to its original type (because insertBreak caused it to take the first node's type)
      Transforms.setNodes(editor, { type: lastNodeType }, { at: lastPathRef.current })

      // remove the reference
      lastPathRef.unref()
    } else {
      const { anchor, focus } = oldSelection
      const startWasSelected = anchor.offset === 0 || focus.offset === 0

      insertBreak()

      const newSelection = editor.selection
      if (!newSelection) {
        throw new Error("selection is missing after break")
      }

      // TODO: this might cause issues in nested paths
      // we need to account for a case where the line break was inserted at the start of a block
      // in that case we want to reset the type of the previous node and not the currently selected one's
      const transformPath = [newSelection.anchor.path[0] - (startWasSelected ? 1 : 0)]

      // set type of last node to its original type (because insertBreak caused it to take the first node's type)
      Transforms.setNodes(editor, { type: defaultType }, { at: transformPath })
    }
  }

  return editor
}
