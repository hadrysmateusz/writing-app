import { SlatePlugin } from "@writing-tool/slate-plugins-system"
import { RenderElementListOptions } from "./types"
import { withList } from "./editorOverrides"
import { renderElementList } from "./renderElement"
import { onKeyDownList } from "./onKeyDown"

export const ListPlugin = (options?: RenderElementListOptions): SlatePlugin => ({
	renderElement: renderElementList(options),
	onKeyDown: onKeyDownList(),
	editorOverrides: withList
})
