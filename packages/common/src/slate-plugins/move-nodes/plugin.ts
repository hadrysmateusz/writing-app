import { SlatePlugin } from "@slate-plugin-system/core"

import { onKeyDownMoveNodes } from "./onKeyDown"
import { withMoveNodes } from "./editorOverrides"

export const MoveNodesPlugin = (): SlatePlugin => ({
	onKeyDown: onKeyDownMoveNodes(),
	editorOverrides: withMoveNodes
})
