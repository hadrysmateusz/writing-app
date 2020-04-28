import { SlatePlugin } from "@slate-plugin-system/core"

import { renderElementHeading } from "./renderElement"
import { HeadingsPluginOptions } from "./types"

export const HeadingsPlugin = (
  options?: HeadingsPluginOptions
): SlatePlugin => ({
  renderElement: renderElementHeading(options),
})
