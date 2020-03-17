import { SlatePlugin } from "@writing-tool/slate-plugin-system"
import { onKeyDownMark } from "../../slate-helpers"

import {
	renderLeafInlineCode,
	withInlineCode,
	InlineCodePluginOptions,
	CODE_INLINE
} from "."

export const InlineCodePlugin = ({
	hotkey = "mod+e"
}: InlineCodePluginOptions = {}): SlatePlugin => ({
	renderLeaf: renderLeafInlineCode(),
	onKeyDown: onKeyDownMark({ mark: CODE_INLINE, hotkey }),
	editorOverrides: withInlineCode
})
