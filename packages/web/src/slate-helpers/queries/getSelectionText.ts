import { Editor } from "slate"
import { getText } from "./getText"

/**
 * Get the selected text.
 * Return empty string if there's no selection.
 */
export const getSelectionText = (editor: Editor) =>
  getText(editor, editor.selection)
