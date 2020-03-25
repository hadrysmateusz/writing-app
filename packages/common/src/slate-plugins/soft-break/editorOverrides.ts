import { SoftBreakEditor } from "./types"
import { EditorOverridesFactory } from "@slate-plugin-system/core"
import { insertSoftBreak } from "./helpers"

export const withSoftBreak: EditorOverridesFactory = () => (editor: SoftBreakEditor) => {
  editor.insertSoftBreak = () => {
    // Insert a newline
    insertSoftBreak(editor)
  }

  return editor
}
