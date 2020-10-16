import { Editor } from "slate"

// TODO: the combineReducers function in @reduxjs/toolkit might provide some information on how to make the returned object contain all of the applied types

export const applyPlugins = <T extends Editor>(
  editor: T,
  plugins: any[]
): T => {
  // we reverse the array to execute functions from right to left
  plugins.reverse().forEach((plugin) => {
    if (plugin.editorOverrides) {
      editor = plugin.editorOverrides(editor) as any
    }
  })
  return editor
}
