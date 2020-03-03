import { SlatePlugin, RenderElementOptions } from "../../PluginSystem/types"
import { renderElementLink } from "./renderElementLink"
import { withLink } from "./withLink"

export const LinkPlugin = (options?: RenderElementOptions): SlatePlugin => ({
	renderElement: renderElementLink(options),
	editorOverrides: withLink
})
