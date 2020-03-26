import { getRenderElement } from "@slate-plugin-system/core"

import { HorizontalRuleElement } from "./components"
import { HORIZONTAL_RULE } from "./types"

export const renderElementHorizontalRule = getRenderElement({
	type: HORIZONTAL_RULE,
	component: HorizontalRuleElement
})
