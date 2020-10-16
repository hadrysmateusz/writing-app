import { SoftBreakEditor } from "./types"
import { EditorOverrides } from "@slate-plugin-system/core"
import { insertSoftBreak } from "./helpers"

export const withSoftBreak = (
  _options: any
): EditorOverrides<SoftBreakEditor, SoftBreakEditor> => (
  editor: SoftBreakEditor
) => {
  editor.insertSoftBreak = () => {
    // Insert a newline
    insertSoftBreak(editor)
  }

  return editor
}
