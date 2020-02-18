import isHotkey from "is-hotkey"

import { toggleMark } from "@writing-tool/helpers"

const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+`": "code"
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
