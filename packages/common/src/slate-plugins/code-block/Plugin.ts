import { SlatePlugin } from "@writing-tool/slate-plugin-system"

import { renderElementCodeBlock } from "./renderElement"
import { CodeBlockPluginOptions } from "./types"

export const CodeBlockPlugin = (options?: CodeBlockPluginOptions): SlatePlugin => ({
	renderElement: renderElementCodeBlock(options)
})
