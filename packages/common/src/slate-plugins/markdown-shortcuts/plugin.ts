import { SlatePlugin } from "@slate-plugin-system/core"
import {  MarkdownShortcutsPluginOptions } from "./types"
import { withShortcuts } from "./editorOverrides"

export const MarkdownShortcutsPlugin = (options?: MarkdownShortcutsPluginOptions): SlatePlugin => ({
	editorOverrides: withShortcuts(options)
})
