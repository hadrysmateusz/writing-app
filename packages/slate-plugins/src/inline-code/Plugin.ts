import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderElementInlineCode } from "./renderElement"
import { withInlineCode } from "./withInlineCode"
import { InlineCodePluginOptions } from "./types"

export const InlineCodePlugin = (options?: InlineCodePluginOptions): SlatePlugin => ({
	renderElement: renderElementInlineCode(options),
	editorOverrides: withInlineCode
})
