import { WatcherUnsubObj } from "shared"

import { getDirWatchers } from "./getDirWatchers"

export const closeWatcherForDir = async (
  dirPath: string,
  timestamp?: number
) => {
  // const log = (msg) => console.log("closeWatcherForDir: " + msg)

  const oldWatcher: WatcherUnsubObj | undefined = getDirWatchers()[dirPath]
  if (oldWatcher) {
    if (!timestamp || timestamp > oldWatcher.added) {
      await oldWatcher.close()
      // log("watcher closed")
      return true
    } else {
      // log("skipping, watcher is younger than timestamp")
      return false
    }
  }
  // log("no old watcher")
  return false
}
