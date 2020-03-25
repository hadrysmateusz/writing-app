import { getRenderElement } from "@slate-plugin-system/core"

import { CodeBlockElement } from "./components"
import { CODE_BLOCK } from "./types"

export const renderElementCodeBlock = getRenderElement({
	type: CODE_BLOCK,
	component: CodeBlockElement
})
