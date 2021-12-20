import { DirObjectRecursive } from "shared"

// TODO: maybe move this to the more general helpers file in the parent dir

export const findClosestMatch = (
  dirs: DirObjectRecursive[],
  wantedPath: string
) => {
  const closestMatch = dirs.find((dir) => {
    return wantedPath.includes(dir.path)
  })
  return closestMatch
}

export const findExactMatch = (
  dirs: DirObjectRecursive[],
  wantedPath: string
) => {
  const exactMatch = dirs.find((dir) => {
    return dir.path === wantedPath
  })
  return exactMatch
}

export const findDirInTrees = (
  dirs: DirObjectRecursive[],
  wantedPath: string
): DirObjectRecursive | undefined => {
  const exactMatch = findExactMatch(dirs, wantedPath)
  if (exactMatch) {
    return exactMatch
  } else {
    const closestMatch = findClosestMatch(dirs, wantedPath)
    if (!closestMatch) {
      return undefined
    } else {
      return findDirInTrees(closestMatch.dirs, wantedPath)
    }
  }
}
