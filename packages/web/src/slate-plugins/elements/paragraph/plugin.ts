import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementParagraph } from "./renderElement"
import { withParagraph } from "./editorOverrides"
import { ParagraphPluginOptions } from "./types"

export const ParagraphPlugin = (
  options?: ParagraphPluginOptions
): SlatePlugin => ({
  renderElement: renderElementParagraph(options),
  editorOverrides: withParagraph,
})
