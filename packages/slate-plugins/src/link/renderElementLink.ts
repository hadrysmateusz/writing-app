import { LinkElement } from "./LinkElement"
import { LINK } from "./types"

import { getRenderElement } from "@writing-tool/slate-plugins-system"

export const renderElementLink = getRenderElement({
	type: LINK,
	component: LinkElement
})
