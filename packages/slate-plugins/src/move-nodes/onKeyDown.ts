import { Transforms, Path, Node, Editor } from "slate"
import { ReactEditor } from "slate-react"
import { getSelectedNodes } from "@writing-tool/slate-helpers"

export const onKeyDownMoveNodes = () => (e: KeyboardEvent, editor: ReactEditor) => {
	if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
		e.preventDefault()

		console.log("moving")

		const entries = getSelectedNodes(editor)
		entries.forEach(([node, path]) => console.log(node, path))
		const firstPath = entries[0][1]
		const lastPath = entries[entries.length - 1][1]

		switch (e.key) {
			case "ArrowUp":
				if (firstPath[firstPath.length - 1] === 0) {
					console.log("CAN'T MOVE FURTHER UP")
					break
				}

				Editor.withoutNormalizing(editor, () => {
					const firstPath = entries[0][1]
					const lastPath = entries[entries.length - 1][1]

					const previousPath = Path.previous(firstPath)

					Transforms.moveNodes(editor, {
						to: lastPath,
						at: previousPath,
						mode: "highest"
					})
				})

				break
			case "ArrowDown":
				const parentNode = Node.parent(editor, lastPath)
				const numChildren = parentNode.children.length
				if (lastPath[lastPath.length - 1] === numChildren - 1) {
					console.log("CAN'T MOVE FURTHER DOWN")
					break
				}

				Editor.withoutNormalizing(editor, () => {
					const firstPath = entries[0][1]
					const lastPath = entries[entries.length - 1][1]
					const nextPath = Path.next(lastPath)

					Transforms.moveNodes(editor, {
						to: firstPath,
						at: nextPath,
						mode: "highest"
					})
				})

				break
		}
	}
}
