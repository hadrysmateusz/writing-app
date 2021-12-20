import chokidar from "chokidar"
import { WatcherUnsubObj } from "shared"

import { getDirWatchers } from "../helpers"

export const createAndSaveWatcher = (dirPath: string): chokidar.FSWatcher => {
  const watcher = createWatcher(dirPath)
  saveWatcherForDir(dirPath, watcher)
  return watcher
}

export const createWatcher = (dirPath: string): chokidar.FSWatcher => {
  const watcher = chokidar.watch(dirPath, {
    persistent: true,
    ignoreInitial: true,
  })
  return watcher
}

export const saveWatcherForDir = (
  dirPath: string,
  watcher: chokidar.FSWatcher
) => {
  getDirWatchers()[dirPath] = {
    close: () => closeWatcher(watcher),
    added: Date.now(),
  }
}

export const closeWatcher = (watcher: chokidar.FSWatcher): Promise<void> => {
  const boundClose = watcher.close.bind(watcher)
  return boundClose()
}

export const closeWatcherForDir = async (
  dirPath: string,
  timestamp?: number
) => {
  const oldWatcher: WatcherUnsubObj | undefined = getDirWatchers()[dirPath]
  if (oldWatcher) {
    if (!timestamp || timestamp > oldWatcher.added) {
      await oldWatcher.close()
      return true
    } else {
      return false
    }
  }
  return false
}
