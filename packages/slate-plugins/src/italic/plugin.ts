import { SlatePlugin } from "@writing-tool/slate-plugins-system"
import { onKeyDownMark } from "@writing-tool/slate-helpers"

import { renderLeafItalic } from "./renderLeaf"
import { ItalicPluginOptions, ITALIC } from "./types"

export const ItalicPlugin = ({
	hotkey = "mod+i"
}: ItalicPluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafItalic(),
	onKeyDown: onKeyDownMark({ mark: ITALIC, hotkey })
})
