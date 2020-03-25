import isHotkey from "is-hotkey"
import { Block } from "../../slate-helpers"
import { SoftBreakEditor } from "../soft-break/types"
import { CODE_BLOCK } from "./types"

export const onKeyDownCodeBlock = () => (event: KeyboardEvent, editor: SoftBreakEditor) => {
  if (isHotkey("Enter", event)) {
    const [firstNode] = Block.first(editor)

    // If the node type is not code_block, run default insertBreak
    if (firstNode.type !== CODE_BLOCK) return
    // prevent default which is an insertBreak command
    event.preventDefault()
    // insert soft break (defaults back to default insertBreak if type doesn't match)
    editor.insertSoftBreak()
  }
}
