import { SoftBreakPluginOptions, SoftBreakEditor } from "./types"
import { EditorOverridesFactory } from "@slate-plugin-system/core"
import { Block } from "../../slate-helpers"

export const withSoftBreak: EditorOverridesFactory = ({
  include,
  exclude
}: SoftBreakPluginOptions = {}) => (editor: SoftBreakEditor) => {
  const { insertBreak } = editor

  editor.insertSoftBreak = () => {
    const [firstNode] = Block.first(editor)
    const isExcluded = exclude && exclude.includes(firstNode.type)
    const isNotIncluded = include && !include.includes(firstNode.type)

    // If the type is explicity excluded or not included a default line break should be inserted
    if (isExcluded || isNotIncluded) {
      return insertBreak()
    }

    // Insert a newline
    editor.insertText("\n")
  }

  return editor
}
