import { Node } from "slate"

// TODO: serialization should save more info than just text

export const serialize = (value) => {
	return value.map((n) => Node.string(n)).join("\n")
}

export const deserialize = (string) => {
	// Return a value array of children derived by splitting the string
	return string.split("\n").map((line) => {
		return { children: [{ text: line }] }
	})
}
