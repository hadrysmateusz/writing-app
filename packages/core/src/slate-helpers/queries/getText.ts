import { Editor, Location } from "slate"

/**
 * Returns text at a given location or empty string if `at` is not specified
 */
export const getText = (editor: Editor, at?: Location | null) =>
  (at && Editor.string(editor, at)) ?? ""
