import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderLeafItalic } from "./renderLeaf"
import { ItalicPluginOptions } from "./types"

export const ItalicPlugin = (options?: ItalicPluginOptions): SlatePlugin => ({
	renderLeaf: renderLeafItalic(options)
})
