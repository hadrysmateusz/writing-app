import { SlatePlugin } from "@writing-tool/slate-plugin-system"

import { onKeyDownMoveNodes } from "./onKeyDown"
import { withMoveNodes } from "./editorOverrides"

export const MoveNodesPlugin = (): SlatePlugin => ({
	onKeyDown: onKeyDownMoveNodes(),
	editorOverrides: withMoveNodes
})
