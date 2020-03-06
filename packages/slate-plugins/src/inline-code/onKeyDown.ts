import isHotkey from "is-hotkey"
import { Editor } from "slate"
import { insertInlineCode } from "."

export const onKeyDownInlineCode = ({ hotkey }) => (event: any, editor: Editor) => {
	if (isHotkey(hotkey, event)) {
		event.preventDefault()
		insertInlineCode(editor)
	}
}
