import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementParagraph } from "./renderElement"
import { withParagraph } from "./editorOverrides"
import { ParagraphPluginOptions } from "./types"
import { ReactEditor } from "slate-react"

export const ParagraphPlugin = (
  options?: ParagraphPluginOptions
): SlatePlugin<ReactEditor, ReactEditor> => ({
  renderElement: renderElementParagraph(options),
  editorOverrides: withParagraph,
})
