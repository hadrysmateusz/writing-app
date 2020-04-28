import { SlatePlugin } from "@slate-plugin-system/core"

import { onKeyDownMoveNode } from "./onKeyDown"

export const MoveNodePlugin = (): SlatePlugin => ({
  onKeyDown: onKeyDownMoveNode(),
})
