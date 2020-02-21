import isHotkey from "is-hotkey"

import { toggleMark } from "@writing-tool/helpers"
import { MARKS } from "@writing-tool/constants/src/Slate"

const HOTKEYS = {
	"mod+b": MARKS.BOLD,
	"mod+i": MARKS.ITALIC,
	"mod+`": MARKS.CODE
}

export default (editor, event) => {
	for (const hotkey in HOTKEYS) {
		if (isHotkey(hotkey, event)) {
			event.preventDefault()
			const mark = HOTKEYS[hotkey]
			toggleMark(editor, mark)
		}
	}
}
