import { getRenderElement } from "@writing-tool/slate-plugin-system"

import { LinkElement } from "./components"
import { LINK } from "./types"

export const renderElementLink = getRenderElement({
	type: LINK,
	component: LinkElement
})
