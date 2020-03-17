import Prism from "../prism"
import { Text } from "slate"

export default ([node, path]) => {
	const ranges = []

	if (!Text.isText(node)) {
		return ranges
	}

	const getLength = (token) => {
		if (typeof token === "string") {
			return token.length
		} else if (typeof token.content === "string") {
			return token.content.length
		} else {
			return token.content.reduce((l, t) => l + getLength(t), 0)
		}
	}

	const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
	let start = 0

	for (const token of tokens) {
		const length = getLength(token)
		const end = start + length

		if (typeof token !== "string") {
			ranges.push({
				[token.type]: true,
				anchor: { path, offset: start },
				focus: { path, offset: end }
			})
		}

		start = end
	}

	return ranges
}
