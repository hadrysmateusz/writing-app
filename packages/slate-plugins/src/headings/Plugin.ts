import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderElementHeading } from "./renderElement"
import { HeadingsPluginOptions } from "./types"

export const HeadingsPlugin = (options?: HeadingsPluginOptions): SlatePlugin => ({
	renderElement: renderElementHeading(options)
})
