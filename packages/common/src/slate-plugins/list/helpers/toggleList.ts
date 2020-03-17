import { Editor, Transforms } from "slate"

import { DEFAULT, isBlockActive } from "../../../slate-helpers"

import { ListType } from "../types"
import { unwrapList } from "./unwrapList"

export const toggleList = (editor: Editor, listType: string) => {
	const isActive = isBlockActive(editor, listType)

	unwrapList(editor)

	Transforms.setNodes(editor, {
		type: DEFAULT
	})

	if (!isActive) {
		const list = { type: listType, children: [] }
		Transforms.wrapNodes(editor, list)

		const nodes = Editor.nodes(editor, {
			match: (node) => node.type === DEFAULT
		})

		const listItem = { type: ListType.LIST_ITEM, children: [] }
		for (const [, path] of nodes) {
			Transforms.wrapNodes(editor, listItem, { at: path })
		}
	}
}
