import chokidar from "chokidar"

import { getDirWatchers } from "../helpers"
import { WatcherUnsubObj } from "../types"

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
  const newWatcherUnsubObj = {
    watcher: watcher,
    added: Date.now(),
  }

  getDirWatchers()[dirPath] = newWatcherUnsubObj
}

export const closeWatcherForDir = async (
  dirPath: string,
  timestamp?: number
) => {
  const oldWatcher: WatcherUnsubObj | undefined = getDirWatchers()[dirPath]

  if (oldWatcher) {
    if (!timestamp || timestamp > oldWatcher.added) {
      await oldWatcher.watcher.close()
      console.log(`SUCCESS: closed watcher for dir ${dirPath}`)
    } else {
      console.log(`FAILURE: couldn't close watcher for dir ${dirPath}`)
    }

    delete getDirWatchers()[dirPath]
  }
  return false
}
