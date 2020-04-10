import { getRenderElement } from "@slate-plugin-system/core"

import { ParagraphElement } from "./components"
import { PARAGRAPH } from "./types"

export const renderElementParagraph = getRenderElement({
	type: PARAGRAPH,
	component: ParagraphElement
})
