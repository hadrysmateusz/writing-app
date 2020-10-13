import isHotkey from "is-hotkey"
import { Editor } from "slate"
import { toggleMark, OnKeyDownMarkOptions } from "."

export const onKeyDownMark = ({ mark, hotkey }: OnKeyDownMarkOptions) => (
  event: any,
  editor: Editor
) => {
  if (isHotkey(hotkey, event)) {
    event.preventDefault()
    toggleMark(editor, mark)
  }
}
