import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementLink } from "./renderElement"
import { withLink } from "./withLink"
import { LinkPluginOptions } from "./types"

export const LinkPlugin = (options?: LinkPluginOptions): SlatePlugin => ({
	renderElement: renderElementLink(options),
	editorOverrides: withLink
})
