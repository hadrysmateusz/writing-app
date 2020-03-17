import { getRenderElement } from "@writing-tool/slate-plugins-system"

import { BlockquoteElement } from "./components"
import { BLOCKQUOTE } from "./types"

export const renderElementBlockquote = getRenderElement({
	type: BLOCKQUOTE,
	component: BlockquoteElement
})
