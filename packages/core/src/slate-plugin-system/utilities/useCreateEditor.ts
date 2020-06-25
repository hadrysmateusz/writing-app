import { useMemo } from "react"
import { createEditor, Editor } from "slate"
import { withReact } from "slate-react"

import { SlatePlugin } from "../types"
import { applyPlugins } from "./applyPlugins"

/**
 * Creates the editor object and applies all of the passed-in plugins
 * @param plugins array of plugins
 * @param dependencies dependency array for useMemo - useful when you need to replace the editor object under certain conditions
 */

export const useCreateEditor = (
  plugins: SlatePlugin[] = [],
  dependencies: any[] = []
) => {
  return useMemo(() => {
    let editor = withReact(createEditor()) as Editor
    editor = applyPlugins(editor, plugins)
    return editor
  }, dependencies)
}
