import { NodeEntry } from "slate"
import { getLastPathIndex, SortingDirection } from "."

export const sortNodeEntries = (
	entries: NodeEntry[],
	direction: SortingDirection = "asc"
): NodeEntry[] => {
	return entries.sort((entryA, entryB) => {
		const lastIndexA = getLastPathIndex(entryA[1])
		const lastIndexB = getLastPathIndex(entryB[1])

		if (direction === "desc") {
			return lastIndexB - lastIndexA
		}
		return lastIndexA - lastIndexB
	})
}
