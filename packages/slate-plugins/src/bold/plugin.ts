import { SlatePlugin } from "@writing-tool/slate-plugins-system"
import { onKeyDownMark } from "@writing-tool/slate-helpers"

import { renderLeafBold } from "./renderLeaf"
import { BoldPluginOptions, BOLD } from "./types"

export const BoldPlugin = ({
	hotkey = "mod+b"
}: BoldPluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafBold(),
	onKeyDown: onKeyDownMark({ mark: BOLD, hotkey })
})
