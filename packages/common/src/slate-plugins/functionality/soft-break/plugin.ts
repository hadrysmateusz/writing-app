import { SlatePlugin } from "@slate-plugin-system/core"
import { SoftBreakPluginOptions } from "./types"
import { onKeyDownSoftBreak } from "./onKeyDown"
import { withSoftBreak } from "./editorOverrides"

export const SoftBreakPlugin = (options?: SoftBreakPluginOptions): SlatePlugin => ({
	onKeyDown: onKeyDownSoftBreak(options),
	editorOverrides: withSoftBreak(options)
})
