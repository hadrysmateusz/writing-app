import { WatcherUnsubObj } from "../types"

export const getDirWatchers = () => {
  if (!dirWatchers) {
    // TODO: create custom error for this
    throw new Error("dirWatchers is undefined")
  }
  return global.dirWatchers as Record<string, WatcherUnsubObj>
}
