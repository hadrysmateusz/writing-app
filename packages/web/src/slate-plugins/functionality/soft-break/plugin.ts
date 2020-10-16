import { SlatePlugin } from "@slate-plugin-system/core"
import { SoftBreakPluginOptions, SoftBreakEditor } from "./types"
import { onKeyDownSoftBreak } from "./onKeyDown"
import { withSoftBreak } from "./editorOverrides"

export const SoftBreakPlugin = (
  options?: SoftBreakPluginOptions
): SlatePlugin<SoftBreakEditor, SoftBreakEditor> => ({
  onKeyDown: onKeyDownSoftBreak(options) as any,
  editorOverrides: withSoftBreak(options),
})
