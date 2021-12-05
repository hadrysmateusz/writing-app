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

export const findDirInDir = (
  checkedDir: DirObjectRecursive,
  dirPathArr: string[],
  i: number
) => {
  console.log("findDirInDir", checkedDir, dirPathArr, dirPathArr[i])

  const isCurrentDirTheDir = checkedDir.path === dirPathArr[i]
  if (isCurrentDirTheDir) {
    const isCurrentCheckedPathLastInDirPathArr = i === dirPathArr.length - 1
    if (isCurrentCheckedPathLastInDirPathArr) {
      return checkedDir
    } else {
      for (let dir of checkedDir.dirs) {
        const foundDir = findDirInDir(dir, dirPathArr, i + 1)
        if (foundDir) {
          return foundDir
        }
      }
    }
  }
}
