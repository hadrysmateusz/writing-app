import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementBlockquote } from "./renderElement"
import { withBlockquote } from "./editorOverrides"
import { BlockquotePluginOptions } from "./types"

export const BlockquotePlugin = (options?: BlockquotePluginOptions): SlatePlugin => ({
	renderElement: renderElementBlockquote(options),
	editorOverrides: withBlockquote
})
