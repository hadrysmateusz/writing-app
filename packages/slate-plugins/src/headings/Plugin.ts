import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderElementHeading } from "./renderElement"
import { HeadingsPluginOptions } from "./types"
import { withHeadings } from "./editorOverrides"

export const HeadingsPlugin = (options?: HeadingsPluginOptions): SlatePlugin => ({
	renderElement: renderElementHeading(options),
	editorOverrides: withHeadings
})
