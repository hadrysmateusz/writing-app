import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementHorizontalRule } from "./renderElement"
import { withHorizontalRule } from "./editorOverrides"
import { HorizontalRulePluginOptions } from "./types"

export const HorizontalRulePlugin = (options?: HorizontalRulePluginOptions): SlatePlugin => ({
	renderElement: renderElementHorizontalRule(options),
	editorOverrides: withHorizontalRule()
})
