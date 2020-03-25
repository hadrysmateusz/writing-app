import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementHeading } from "./renderElement"
import { HeadingsPluginOptions } from "./types"
import { withHeadings } from "./editorOverrides"

export const HeadingsPlugin = (options?: HeadingsPluginOptions): SlatePlugin => ({
	renderElement: renderElementHeading(options),
	editorOverrides: withHeadings
})
