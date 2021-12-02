import { TabsState } from "../../../MainProvider/tabsSlice"

import { DirObjectRecursive } from "./types"

/**
 * Checks tabs state for a tab with a local document with path matching the param
 * @returns tabId of the tab containing the document or null if such tab wasn't found
 */
export function findTabWithPath(
  tabsState: TabsState,
  path: string
): string | null {
  let foundTabId: string | null = null
  Object.entries(tabsState.tabs).some(([tabId, tab]) => {
    if (tab.tabType === "localDocument" && tab.path === path) {
      foundTabId = tabId
      return true
    }
    return false
  })
  return foundTabId
}

export const findDirInCurrentDir = (
  dir: DirObjectRecursive,
  dirPathToFind: string
) => {
  return dir.dirs.find((dir) => dir.path === dirPathToFind)
}

export const findDirInChildDirs = (
  dirs: DirObjectRecursive[],
  dirPathToFind: string
) => {
  let foundDir: DirObjectRecursive | undefined
  for (let dir of dirs) {
    let foundDirInChild = findDirInCurrentDir(dir, dirPathToFind)
    // when we find correct dir, we exit the loop with the result
    if (foundDirInChild) {
      foundDir = foundDirInChild
      break
    }
  }
  return foundDir
}

export const findDirInDir = (
  checkedDir: DirObjectRecursive,
  dirPathArr: string[],
  i: number
) => {
  const foundDir = findDirInCurrentDir(checkedDir, dirPathArr[i])
  if (foundDir) {
    // search for the dir next nesting level
    return findDirInCurrentDir(foundDir, dirPathArr[i + 1])
  } else {
    // search for the dir in child dirs
    return findDirInChildDirs(checkedDir.dirs, dirPathArr[i])
  }
}
