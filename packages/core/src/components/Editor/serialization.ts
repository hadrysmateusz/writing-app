import { Node } from "slate"

export const serialize = (value: Node[]) => {
	return JSON.stringify(value)
}

export const deserialize = (value: string): Node[] => {
	try {
		return JSON.parse(value) as Node[]
	} catch (err) {
		console.group("Couldn't deserialize JSON to slate value")
		console.log("VALUE:")
		console.log(value)
		console.log("ERROR:")
		console.log(err)
		console.groupEnd()
		throw new Error("Couldn't deserialize JSON to slate value")
	}
}
