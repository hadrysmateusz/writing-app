import isHotkey from "is-hotkey"
import { SoftBreakEditor, SoftBreakPluginOptions } from "./types"

export const onKeyDownSoftBreak = ({
  hotkey = "shift+Enter"
}: SoftBreakPluginOptions = {}) => (event: KeyboardEvent, editor: SoftBreakEditor) => {
  if (isHotkey(hotkey, event)) {
    // prevent default which is an insertBreak command
    event.preventDefault()
    // insert soft break (defaults back to default insertBreak if type doesn't match)
    editor.insertSoftBreak()
  }
}
