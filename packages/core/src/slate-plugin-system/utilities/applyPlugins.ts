import { Editor } from "slate"
import { SlatePlugin } from "types"

// TODO: the combineReducers function in @reduxjs/toolkit might provide some information on how to make the returned object contain all of the applied types

export const applyPlugins = (
  editor: Editor,
  plugins: SlatePlugin[]
): Editor => {
  // we reverse the array to execute functions from right to left
  plugins.reverse().forEach((plugin) => {
    if (plugin.editorOverrides) {
      editor = plugin.editorOverrides(editor)
    }
  })
  return editor
}
