import { SlatePlugin } from "@writing-tool/slate-plugin-system"
import { onKeyDownMark } from "../../slate-helpers"

import { renderLeafStrikethrough } from "./renderLeaf"
import { StrikethroughPluginOptions, STRIKE } from "./types"

export const StrikethroughPlugin = ({
	hotkey = "mod+shift+k"
}: StrikethroughPluginOptions): SlatePlugin => ({
	renderLeaf: renderLeafStrikethrough(),
	onKeyDown: onKeyDownMark({ mark: STRIKE, hotkey })
})
