import isHotkey from "is-hotkey"

import { MARKS, ELEMENTS } from "@writing-tool/constants/src/Slate"

import { toggleFormat } from "./helpers"

const HOTKEYS = {
	"mod+e": ELEMENTS.CODE_INLINE
}

export default (editor, event) => {
	for (const hotkey in HOTKEYS) {
	}
}
