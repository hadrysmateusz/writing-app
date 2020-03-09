import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { onKeyDownMoveNodes } from "./onKeyDown"
import { withMoveNodes } from "./editorOverrides"

export const MoveNodesPlugin = (): SlatePlugin => ({
	onKeyDown: onKeyDownMoveNodes(),
	editorOverrides: withMoveNodes
})
