import { ReactEditor } from "slate-react"
// import { Transforms, Text } from "slate"

// import { getMarksOnNode } from "../../../slate-helpers"

// import { CODE_INLINE } from "./types"

export const withInlineCode = <T extends ReactEditor>(editor: T) => {
  // const { normalizeNode } = editor

  // editor.normalizeNode = (entry) => {
  //   const [node, path] = entry

  //   // if the node is a leaf node that contains an inline_code mark, make sure it doesn't contain any other marks
  //   if (node.text) {
  //     const marks = getMarksOnNode(node as Text)

  //     if (marks.includes(CODE_INLINE)) {
  //       // removeMark works on current selection, so we save the original selection for later...
  //       const selectionBefore = editor.selection
  //       // ...and select the inline_code node (the node path is enough)
  //       Transforms.select(editor, path)
  //       // remove all other marks
  //       marks.forEach((mark) => {
  //         if (mark !== CODE_INLINE) {
  //           editor.removeMark(mark)
  //         }
  //       })

  //       // restore the selection to what it was originally
  //       if (selectionBefore === null) {
  //         Transforms.deselect(editor)
  //       } else {
  //         Transforms.select(editor, selectionBefore)
  //       }
  //     }
  //   }

  //   // Fall back to the original `normalizeNode` to enforce other constraints.
  //   normalizeNode(entry)
  // }

  return editor
}
