import { SoftBreakEditor } from "./types"
import { EditorOverrides } from "@slate-plugin-system/core"
import { insertSoftBreak } from "./helpers"

export const withSoftBreak = (): EditorOverrides => (editor: SoftBreakEditor) => {
  editor.insertSoftBreak = () => {
    // Insert a newline
    insertSoftBreak(editor)
  }

  return editor
}
