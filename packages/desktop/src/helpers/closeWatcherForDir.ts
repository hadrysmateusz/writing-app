import { WatcherUnsubObj } from "../types"

export const closeWatcherForDir = async (
  dirPath: string,
  timestamp?: number
) => {
  const log = (msg) => console.log("closeWatcherForDir: " + msg)
  if (!global.dirWatchers) {
    global.dirWatchers = {}
  }
  const oldWatcher: WatcherUnsubObj | undefined = global.dirWatchers[dirPath]
  if (oldWatcher) {
    if (!timestamp || timestamp > oldWatcher.added) {
      await oldWatcher.close()
      log("watcher closed")
      return true
    } else {
      log("skipping, watcher is younger than timestamp")
      return false
    }
  }
  log("no old watcher")
  return false
}
