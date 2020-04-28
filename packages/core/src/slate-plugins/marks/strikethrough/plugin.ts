import { SlatePlugin } from "@slate-plugin-system/core"
import { onKeyDownMark } from "../../../slate-helpers"

import { renderLeafStrikethrough } from "./renderLeaf"
import { StrikethroughPluginOptions, STRIKE } from "./types"

export const StrikethroughPlugin = ({
  hotkey = "mod+shift+k",
}: StrikethroughPluginOptions): SlatePlugin => ({
  renderLeaf: renderLeafStrikethrough(),
  onKeyDown: onKeyDownMark({ mark: STRIKE, hotkey }),
})
