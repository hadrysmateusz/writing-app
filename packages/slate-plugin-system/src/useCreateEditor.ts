import { useMemo } from "react"
import { createEditor } from "slate"
import { withReact } from "slate-react"

import { compose } from "lodash/fp"
import { SlatePlugin, EditorOverrides } from "types"

/**
 * Creates the editor object and applies all of the passed-in plugins
 * @param plugins array of plugins
 */

export function useCreateEditor(plugins: SlatePlugin[] = []) {
  // only get the editorOverride functions from the plugins which have them
  const editorOverrides = plugins.reduce(
    (acc: EditorOverrides[], plugin: SlatePlugin) => {
      if (!plugin.editorOverrides) {
        return acc
      } else {
        return [...acc, plugin.editorOverrides]
      }
    },
    []
  )
  /* Compose is a higher-order function returning a function that will be run be the hook - I'm not wrapping it because it would require adding 'plugins' as the hook's dependency which in turn would require making sure the plugins array stays the same on every render to prevent re-creating the editor every time */
  // TODO: it would be nice to write a custom compose function to remove the need for the lodash dependency
  return useMemo(compose(...editorOverrides, withReact, createEditor), [])
}
