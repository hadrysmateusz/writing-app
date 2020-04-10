import { EditorOverrides } from "@slate-plugin-system/core"
import { Editor } from "slate"
import { HORIZONTAL_RULE } from "./types"

export const withHorizontalRule = (): EditorOverrides => (editor: Editor) => {
  const { isVoid } = editor

  editor.isVoid = (node) => {
    return node.type === HORIZONTAL_RULE ? true : isVoid(node)
  }

  // it might simply be possible to replace the unit to block when the type of node to be deleted is horizontal rule

  // editor.deleteForward = (unit) => {
  //   // TODO: remove node
  // }

  // editor.deleteBackward = (unit)=> {
  //   // TODO: remove node
  // }

  return editor
}
