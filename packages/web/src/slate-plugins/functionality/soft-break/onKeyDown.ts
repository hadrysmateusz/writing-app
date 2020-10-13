import isHotkey from "is-hotkey"
import { SoftBreakEditor, SoftBreakPluginOptions } from "./types"
import { Block, isNodeIncluded } from "../../../slate-helpers"

export const onKeyDownSoftBreak = ({
  hotkey = "shift+Enter",
  include,
  exclude,
}: SoftBreakPluginOptions = {}) => (
  event: KeyboardEvent,
  editor: SoftBreakEditor
) => {
  if (isHotkey(hotkey, event)) {
    const [firstNode] = Block.first(editor)
    // If the type is explicity excluded or not included, a default line break should be inserted
    if (!isNodeIncluded(firstNode, include, exclude)) return
    // prevent default which is an insertBreak command
    event.preventDefault()
    // insert soft break (defaults back to default insertBreak if type doesn't match)
    editor.insertSoftBreak()
  }
}
