import { SlatePlugin, RenderElementOptions } from "@writing-tool/slate-plugins-system"

import { renderElementInlineCode } from "./renderElement"
import { withInlineCode } from "./withInlineCode"

export const InlineCodePlugin = (options?: RenderElementOptions): SlatePlugin => ({
	renderElement: renderElementInlineCode(options),
	editorOverrides: withInlineCode
})
