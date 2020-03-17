import { SlatePlugin } from "@writing-tool/slate-plugin-system"

import { renderElementLink } from "./renderElement"
import { withLink } from "./withLink"
import { LinkPluginOptions } from "./types"

export const LinkPlugin = (options?: LinkPluginOptions): SlatePlugin => ({
	renderElement: renderElementLink(options),
	editorOverrides: withLink
})
