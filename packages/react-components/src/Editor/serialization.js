// TODO: optimize this

const EMPTY = [{ children: [{ text: "" }] }]

export const serialize = (value) => {
	return JSON.stringify(value)
}

export const deserialize = (value) => {
	try {
		return JSON.parse(value)
	} catch (err) {
		return EMPTY
	}
}
