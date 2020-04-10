import { SlatePlugin } from "@slate-plugin-system/core"
import { onKeyDownMark } from "../../../slate-helpers"

import { renderLeafItalic } from "./renderLeaf"
import { ItalicPluginOptions, ITALIC } from "./types"

export const ItalicPlugin = ({
	hotkey = "mod+i"
}: ItalicPluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafItalic(),
	onKeyDown: onKeyDownMark({ mark: ITALIC, hotkey })
})
