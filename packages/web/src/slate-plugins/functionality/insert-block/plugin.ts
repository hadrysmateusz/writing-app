import { SlatePlugin } from "@slate-plugin-system/core"
import { InsertBlockPluginOptions } from "./types"
import { onKeyDownInsertBlock } from "./onKeyDown"

/**
 * Adds a keyboard shortcut for adding a new block below the current one
 *
 * TODO: doesn't work in lists
 */
export const InsertBlockPlugin = (
  options?: InsertBlockPluginOptions
): SlatePlugin => ({
  onKeyDown: onKeyDownInsertBlock(options) as any,
})
