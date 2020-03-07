import { Text } from "slate"

/**
 * A simple function that gets the marks on an arbitrary node.
 * It assumes that any property on a leaf node besides 'text' is a mark
 * (if this turns out not to be true, the logic will have to be changed)
 *
 * @param node leaf node to get the marks from
 */
export const getMarksOnNode = (node: Text) => {
	const marks = Object.entries(node).reduce((acc, [key, val]) => {
		if (key === "text") return acc
		if (val !== true) return acc
		return [...acc, key]
	}, [])

	return marks
}
