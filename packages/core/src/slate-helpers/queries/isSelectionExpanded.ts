import { Editor, Range } from "slate"

/**
 * Is the selection expanded.
 */
export const isSelectionExpanded = (editor: Editor) =>
  !!editor.selection && Range.isExpanded(editor.selection)
