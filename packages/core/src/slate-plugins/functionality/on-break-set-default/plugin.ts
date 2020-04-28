import { SlatePlugin } from "@slate-plugin-system/core"
import { OnBreakSetDefaultOptions } from "./types"
import { withOnBreakSetDefault } from "./editorOverrides"

const defaultOptions: OnBreakSetDefaultOptions = {
  defaultType: "paragraph",
}

export const OnBreakSetDefaultPlugin = (
  options: OnBreakSetDefaultOptions = {}
): SlatePlugin => {
  Object.assign(defaultOptions, options)
  return {
    editorOverrides: withOnBreakSetDefault(options),
  }
}
