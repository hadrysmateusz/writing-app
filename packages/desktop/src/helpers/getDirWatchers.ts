import { WatcherUnsubObj } from "../types"

export const getDirWatchers = () => {
  if (!global.dirWatchers) {
    global.dirWatchers = {}
  }
  return global.dirWatchers as Record<string, WatcherUnsubObj>
}
