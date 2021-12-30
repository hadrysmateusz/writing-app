import { GenericDocGroupTree_Discriminated } from "../../../../types"

// TODO: maybe move this to the more general helpers file in the parent dir

export const findClosestMatch = (
  dirs: GenericDocGroupTree_Discriminated[],
  wantedPath: string
) => {
  const closestMatch = dirs.find((dir) => {
    if (dir.identifier === null) return false
    return wantedPath.includes(dir.identifier)
  })
  return closestMatch
}

export const findExactMatch = (
  dirs: GenericDocGroupTree_Discriminated[],
  wantedPath: string
) => {
  const exactMatch = dirs.find((dir) => {
    return dir.identifier === wantedPath
  })
  return exactMatch
}

export const findDirInTrees = (
  dirs: GenericDocGroupTree_Discriminated[],
  wantedPath: string
): GenericDocGroupTree_Discriminated | undefined => {
  const exactMatch = findExactMatch(dirs, wantedPath)
  if (exactMatch) {
    return exactMatch
  } else {
    const closestMatch = findClosestMatch(dirs, wantedPath)
    if (!closestMatch) {
      return undefined
    } else {
      return findDirInTrees(closestMatch.childGroups, wantedPath)
    }
  }
}
