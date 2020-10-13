import { Path } from "slate"
import { getLastPathIndex, SortingDirection } from "."

export const sortPaths = (
  paths: Path[],
  direction: SortingDirection = "asc"
): Path[] => {
  return paths.sort((pathA, pathB) => {
    const lastIndexA = getLastPathIndex(pathA)
    const lastIndexB = getLastPathIndex(pathB)

    if (direction === "desc") {
      return lastIndexB - lastIndexA
    }
    return lastIndexA - lastIndexB
  })
}
