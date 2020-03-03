import { SlatePlugin, RenderElementOptions } from "@writing-tool/slate-plugins-system"

import { renderElementLink } from "./renderElement"
import { withLink } from "./withLink"

export const LinkPlugin = (options?: RenderElementOptions): SlatePlugin => ({
	renderElement: renderElementLink(options),
	editorOverrides: withLink
})
