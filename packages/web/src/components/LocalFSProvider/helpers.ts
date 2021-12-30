import { WatchDirResPayload } from "shared"

import {
  GenericDocGroupTreeBranch,
  GenericDocument_Discriminated,
} from "../../types"

import { DirState } from "./types"

// TODO: rename these functions to reflect the fact they work with generic groups and documents now

export const findDirInDir = (
  checkedDir: GenericDocGroupTreeBranch,
  dirPathArr: string[],
  i: number
): GenericDocGroupTreeBranch | undefined => {
  console.log("findDirInDir", checkedDir, dirPathArr, dirPathArr[i])

  const isCurrentDirTheDir = checkedDir.identifier === dirPathArr[i]
  if (isCurrentDirTheDir) {
    const isCurrentCheckedPathLastInDirPathArr = i === dirPathArr.length - 1
    if (isCurrentCheckedPathLastInDirPathArr) {
      return checkedDir
    } else {
      for (let dir of checkedDir.childGroups) {
        const foundDir = findDirInDir(dir, dirPathArr, i + 1)
        if (foundDir) {
          return foundDir
        }
      }
    }
  }

  return undefined
}

const findCorrectDirInState = (dirState: DirState, dirPath: string) => {
  return dirState.dirTrees.find((dirTree) => dirTree.identifier === dirPath)
}

export const getDirToModify = (
  prevDirState: DirState,
  payload: WatchDirResPayload
) => {
  const { watchedDirPath, parentDirPathArr } = payload

  // modify only correct dirTree in state
  const prevDir = findCorrectDirInState(prevDirState, watchedDirPath)
  // Don't modify (TODO: maybe harsher handling could be required, maybe send a STOP_WATCH_DIR to remove a stale watcher)
  if (!prevDir) {
    return undefined
  }

  return findDirInDir(prevDir, parentDirPathArr, 0)
}

export const addFileToDirFiles = (
  group: GenericDocGroupTreeBranch,
  documentToAdd: GenericDocument_Discriminated
) => {
  // check for existance first to prevent duplication
  if (
    group.childDocuments.find(
      (file) => file.identifier === documentToAdd.identifier
    )
  ) {
    return
  }
  group.childDocuments.push(documentToAdd)
}

export const removeFileFromDirFiles = (
  group: GenericDocGroupTreeBranch,
  documentIdentifierToRemove: string
) => {
  group.childDocuments = group.childDocuments.filter(
    (file) => file.identifier !== documentIdentifierToRemove
  )
}

export const addDirToDirDirs = (
  group: GenericDocGroupTreeBranch,
  groupToAdd: GenericDocGroupTreeBranch
) => {
  // check for existance first to prevent duplication
  if (
    group.childGroups.find(
      (innerDir) => innerDir.identifier === groupToAdd.identifier
    )
  ) {
    return
  }
  group.childGroups.push(groupToAdd)
}

export const removeDirFromDirDirs = (
  group: GenericDocGroupTreeBranch,
  groupPathToRemove: string
) => {
  group.childGroups = group.childGroups.filter(
    (dirInner) => dirInner.identifier !== groupPathToRemove
  )
}
