import chokidar from "chokidar"

export type OpenFileObject = { name: string; content: string }

export type FileObject = { name: string; path: string }

export type DirObjectRecursive = {
  path: string
  name: string
  dirs: DirObjectRecursive[]
  files: FileObject[]
}

export type WatcherUnsubObj = {
  close: chokidar.FSWatcher["close"]
  added: number
}

export type ValidatePathsObj = {
  path: string
  name: string | null
  exists: boolean
}

// TODO: move to shared location
export enum FileFormats {
  MARKDOWN = "md",
  HTML = "html",
}

// TODO: move to shared location
export enum DialogStatus {
  SUCCESS = "success",
  ERROR = "error",
  CANCELED = "canceled",
}
