import { Editor } from "slate"
import { EditorOverrides } from "../types"

/**
 * Takes a list of EditorOverrides functions and returns a function
 * that calls them all from right to left
 * @param overridesList List of EditorOverrides functions
 */
export const composeOverrides = (
  overridesList: EditorOverrides[]
): EditorOverrides => {
  return (editor: Editor) => {
    let e = editor
    overridesList.reverse().forEach((withOverrides) => {
      editor = withOverrides(editor)
    })
    return e
  }
}
