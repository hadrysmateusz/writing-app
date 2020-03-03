import { getRenderElement } from "../../PluginSystem/getRenderElement"
import { LinkElement } from "./LinkElement"
import { LINK } from "./types"

export const renderElementLink = getRenderElement({
	type: LINK,
	component: LinkElement
})
