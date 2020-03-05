import { SlatePlugin } from "@writing-tool/slate-plugins-system"
import { onKeyDownMark } from "@writing-tool/slate-helpers"

import { renderLeafStrikethrough } from "./renderLeaf"
import { StrikethroughPluginOptions, STRIKE } from "./types"

export const StrikethroughPlugin = ({
	hotkey = "mod+shift+k"
}: StrikethroughPluginOptions): SlatePlugin => ({
	renderLeaf: renderLeafStrikethrough(),
	onKeyDown: onKeyDownMark({ mark: STRIKE, hotkey })
})
