import { DirObjectRecursive, FileObject, WatchDirResPayload } from "shared"

import { findDirInDir } from "../PrimarySidebar/Local"
import { DirState } from "./types"

const findCorrectDirInState = (dirState: DirState, dirPath: string) => {
  return dirState.dirTrees.find((dirTree) => dirTree.path === dirPath)
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
  dir: DirObjectRecursive,
  fileToAdd: FileObject
) => {
  // check for existance first to prevent duplication
  if (dir.files.find((file) => file.path === fileToAdd.path)) {
    return
  }
  dir.files.push(fileToAdd)
}

export const removeFileFromDirFiles = (
  dir: DirObjectRecursive,
  filePathToRemove: string
) => {
  dir.files = dir.files.filter((file) => file.path !== filePathToRemove)
}

export const addDirToDirDirs = (
  dir: DirObjectRecursive,
  dirToAdd: DirObjectRecursive
) => {
  // check for existance first to prevent duplication
  if (dir.dirs.find((innerDir) => innerDir.path === dirToAdd.path)) {
    return
  }
  dir.dirs.push(dirToAdd)
}

export const removeDirFromDirDirs = (
  dir: DirObjectRecursive,
  dirPathToRemove: string
) => {
  dir.dirs = dir.dirs.filter((dirInner) => dirInner.path !== dirPathToRemove)
}
