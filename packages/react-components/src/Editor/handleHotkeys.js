import isHotkey from "is-hotkey"

import { MARKS } from "@writing-tool/constants/src/Slate"

import { toggleMark } from "./helpers"

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
