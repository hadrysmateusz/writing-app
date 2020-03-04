import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderElementBlockquote } from "./renderElement"
import { BlockquotePluginOptions } from "./types"

export const BlockquotePlugin = (options?: BlockquotePluginOptions): SlatePlugin => ({
	renderElement: renderElementBlockquote(options)
})
