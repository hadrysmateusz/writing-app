import { SlatePlugin } from "@slate-plugin-system/core"
import { ListOptions } from "./types"
import { withList } from "./editorOverrides"
import { renderElementList } from "./renderElement"
import { onKeyDownList } from "./onKeyDown"

/**
 * IMPORTANT: has to be added before the OnBreakSetDefault plugin
 */
export const ListPlugin = (options: ListOptions = {}): SlatePlugin => ({
  renderElement: renderElementList(options),
  onKeyDown: onKeyDownList(options),
  editorOverrides: withList(options),
})
