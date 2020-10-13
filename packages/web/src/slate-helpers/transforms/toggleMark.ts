import { Editor } from "slate"
import { isMarkActive } from ".."

export const toggleMark = (editor: Editor, key: string) => {
  const isActive = isMarkActive(editor, key)

  if (isActive) {
    editor.removeMark(key)
  } else {
    editor.addMark(key, true)
  }
}
