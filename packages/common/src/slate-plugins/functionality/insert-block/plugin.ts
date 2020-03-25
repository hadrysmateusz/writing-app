import { SlatePlugin } from "@slate-plugin-system/core"
import { InsertBlockPluginOptions } from "./types"
import { onKeyDownInsertBlock } from "./onKeyDown"

export const InsertBlockPlugin = (options?: InsertBlockPluginOptions): SlatePlugin => ({
  onKeyDown: onKeyDownInsertBlock(options)
})
