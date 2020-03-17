import { Editor, Transforms } from "slate"
import { Ancestor } from "slate"

const PARAGRAPH = "paragraph"

export const isBlockTextEmpty = (node: Ancestor) =>
	node.children && node.children[node.children.length - 1]?.text?.length === 0

export const withBreakEmptyReset = ({
	types,
	onUnwrap
}: {
	types: string[]
	onUnwrap?: any
}) => <T extends Editor>(editor: T) => {
	const { insertBreak } = editor

	editor.insertBreak = () => {
		const currentNodeEntry = Editor.above(editor, {
			match: (n) => Editor.isBlock(editor, n)
		})

		if (currentNodeEntry) {
			const [currentNode] = currentNodeEntry

			if (isBlockTextEmpty(currentNode)) {
				const parent = Editor.above(editor, {
					match: (n) => types.includes(n.type)
				})

				if (parent) {
					Transforms.setNodes(editor, { type: PARAGRAPH })

					if (onUnwrap) onUnwrap()

					return
				}
			}
		}

		insertBreak()
	}

	return editor
}
