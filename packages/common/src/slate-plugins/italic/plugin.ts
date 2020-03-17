import { SlatePlugin } from "@writing-tool/slate-plugin-system"
import { onKeyDownMark } from "../../slate-helpers"

import { renderLeafItalic } from "./renderLeaf"
import { ItalicPluginOptions, ITALIC } from "./types"

export const ItalicPlugin = ({
	hotkey = "mod+i"
}: ItalicPluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafItalic(),
	onKeyDown: onKeyDownMark({ mark: ITALIC, hotkey })
})
