import { SoftBreakEditor } from "../types"

/**
 * Unconditionally inserts a soft break i.e. a newline character
 */
export const insertSoftBreak = (editor: SoftBreakEditor): void => {
  editor.insertText("\n")
}