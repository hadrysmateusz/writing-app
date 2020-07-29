import { config } from "@writing-tool/core"
import { Operation, Editor } from "slate"
import getCommonNodes from "../../../slate-helpers/getCommonNodes"

export const withLogger = <T extends Editor>(editor: T) => {
  const { apply } = editor

  editor.apply = (op) => {
    // ------------ OPERATIONS ------------
    if (config.logOperations) {
      console.log(op)
      console.trace()
    }

    apply(op)

    // ------------ SELECTION ------------
    // selection is logged after the operation to reflect the newest changes
    if (config.logSelection && Operation.isSelectionOperation(op)) {
      if (editor.selection) {
        const { anchor, focus } = editor.selection
        console.group("selection")
        console.log(
          `ANCHOR: ${JSON.stringify(anchor.path)} +${
            anchor.offset
          } FOCUS: ${JSON.stringify(focus.path)} +${focus.offset}`
        )
        const nodes = getCommonNodes(editor)
        nodes.forEach((node) => console.log(node))
        console.groupEnd()
      } else {
        console.log("selection is null")
      }
    }
  }

  return editor
}
