import { getRenderElement } from "@writing-tool/slate-plugin-system"

import { CodeBlockElement } from "./components"
import { CODE_BLOCK } from "./types"

export const renderElementCodeBlock = getRenderElement({
	type: CODE_BLOCK,
	component: CodeBlockElement
})
