import { SlatePlugin } from "@writing-tool/slate-plugin-system"
import { onKeyDownMark } from "../../slate-helpers"

import { renderLeafBold } from "./renderLeaf"
import { BoldPluginOptions, BOLD } from "./types"

export const BoldPlugin = ({
	hotkey = "mod+b"
}: BoldPluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafBold(),
	onKeyDown: onKeyDownMark({ mark: BOLD, hotkey })
})
