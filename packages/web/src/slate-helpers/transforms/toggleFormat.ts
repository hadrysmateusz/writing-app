import { Transforms } from "slate"

import { LIST_TYPES, BLOCKS, MARKS } from "../../constants/Slate"
import { isFormatActive } from "../queries"

/**
 * Toggles the given formatting in the selection
 * works for all blocks, inlines and marks
 */
export function toggleFormat(editor, format) {
  switch (format) {
    default:
      const isMark = Object.values(MARKS).includes(format)
      const isActive = isFormatActive(editor, format)

      if (isMark) {
        if (isActive) {
          editor.removeMark(format)
        } else {
          editor.addMark(format, true)
        }
      } else {
        const isList = LIST_TYPES.includes(format)

        Transforms.unwrapNodes(editor, {
          match: (n) =>
            typeof n.type === "string" ? LIST_TYPES.includes(n.type) : false,
          split: true,
        })

        Transforms.setNodes(editor, {
          type: isActive
            ? BLOCKS.PARAGRAPH
            : isList
            ? BLOCKS.LIST_ITEM
            : format,
        })

        if (!isActive && isList) {
          const block = { type: format, children: [] }
          Transforms.wrapNodes(editor, block)
        }
      }
  }
}
