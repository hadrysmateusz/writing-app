import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderLeafStrikethrough } from "./renderLeaf"
import { StrikethroughPluginOptions } from "./types"

export const StrikethroughPlugin = (
	options?: StrikethroughPluginOptions
): SlatePlugin => ({
	renderLeaf: renderLeafStrikethrough(options)
})
