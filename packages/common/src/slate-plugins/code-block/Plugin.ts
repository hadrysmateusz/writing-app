import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementCodeBlock } from "./renderElement"
import { CodeBlockPluginOptions } from "./types"

export const CodeBlockPlugin = (options?: CodeBlockPluginOptions): SlatePlugin => ({
	renderElement: renderElementCodeBlock(options)
})
