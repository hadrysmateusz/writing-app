import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderLeafBold } from "./renderLeaf"
import { BoldPluginOptions } from "./types"

export const BoldPlugin = (options?: BoldPluginOptions): SlatePlugin => ({
	renderLeaf: renderLeafBold(options)
})
