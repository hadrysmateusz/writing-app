import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { renderElementInlineCode } from "./renderElement"
import { withInlineCode } from "./withInlineCode"
import { InlineCodePluginOptions } from "./types"
import { onKeyDownInlineCode } from "."

export const InlineCodePlugin = (options: InlineCodePluginOptions = {}): SlatePlugin => {
	const { hotkey = "mod+e" } = options

	return {
		renderElement: renderElementInlineCode(options),
		editorOverrides: withInlineCode,
		onKeyDown: onKeyDownInlineCode({ hotkey })
	}
}
