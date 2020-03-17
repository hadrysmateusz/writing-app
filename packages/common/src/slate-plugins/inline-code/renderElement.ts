import { getRenderElement } from "@writing-tool/slate-plugins-system"

import { InlineCodeElement } from "./components"
import { CODE_INLINE } from "./types"

export const renderElementInlineCode = getRenderElement({
	type: CODE_INLINE,
	component: InlineCodeElement
})
