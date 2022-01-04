import chokidar from "chokidar"

export type WatcherUnsubObj = {
  watcher: chokidar.FSWatcher
  added: number
}
