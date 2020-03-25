import { Editor, Transforms } from "slate"
import { isList, isListItem } from "."

export const unwrapList = (editor: Editor) => {
	Transforms.unwrapNodes(editor, {
		match: isListItem
	})

	Transforms.unwrapNodes(editor, {
		match: isList,
		split: true
	})
}
