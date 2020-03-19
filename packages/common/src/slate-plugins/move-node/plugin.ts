import { SlatePlugin } from "@writing-tool/slate-plugin-system"

import { onKeyDownMoveNode } from "./onKeyDown"

export const MoveNodePlugin = (): SlatePlugin => ({
	onKeyDown: onKeyDownMoveNode()
})
