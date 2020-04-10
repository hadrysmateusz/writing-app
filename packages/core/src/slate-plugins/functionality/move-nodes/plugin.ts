import { SlatePlugin } from "@slate-plugin-system/core"

import { onKeyDownMoveNodes } from "./onKeyDown"

export const MoveNodesPlugin = (): SlatePlugin => ({
	onKeyDown: onKeyDownMoveNodes()
})
