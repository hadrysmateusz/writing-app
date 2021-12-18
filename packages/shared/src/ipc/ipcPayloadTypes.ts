import { DirObjectRecursive, FileFormats } from "../types"

// ====== payload types =======

export type AddPathPayload = {
  defaultPath?: string
}

export type CreateDirPayload = {
  name: string
  parentPath?: string
}

export type CreateFilePayload = {
  name?: string
  defaultPath?: string
}

export type DeleteDirPayload = {
  dirPath: string
}

export type DeleteFilePayload = {
  targetPath: string
}

export type ExportFilePayload = {
  content: string
  format: FileFormats
  name: string | undefined
}

export type GetPathContentsPayload = {
  path: string
}

export type ImportFilePayload = {
  format: FileFormats
}

export type OpenFilePayload = {
  filePath: string
}

export type SaveFilePayload = {
  filePath: string
  content: string
}

export type StopWatchDirPayload = {
  watchedDirPath: string
  timestamp: number
}

export type ValidatePathsPayload = {
  paths: string[]
}

export type ViewInExplorerPayload = {
  targetPath: string
}

export type WatchDirPayload = {
  watchedDirPath: string
}

export type ForceReloadPayload = {}

// ========= main to renderer msg payloads ========
// TODO: maybe move these to other file

// TODO: figure out a better name for this event
export type WatchDirResPayload = {
  eventType: string // TODO: maybe make union type of possible event types

  watchedDirPath: string

  itemPath: string
  itemName: string
  parentDirPath: string
  parentDirPathArr: string[]

  dirTree: DirObjectRecursive | undefined
}

// TODO: rework this or rename the event, or do nothing if I use custom window chrome
export type NewCloudDocumentPayload = {}

// ======= map of msg channels to payload types

export type IpcPayloadTypes = {
  // main->renderer
  "NEW_CLOUD_DOCUMENT": NewCloudDocumentPayload
  "WATCH_DIR:RES": WatchDirResPayload
  // renderer->main
  "EXPORT_FILE": ExportFilePayload
  "IMPORT_FILE": ImportFilePayload
  "ADD_PATH": AddPathPayload
  "GET_PATH_CONTENTS": GetPathContentsPayload
  "VALIDATE_PATHS": ValidatePathsPayload
  "OPEN_FILE": OpenFilePayload
  "SAVE_FILE": SaveFilePayload
  "CREATE_FILE": CreateFilePayload
  "DELETE_FILE": DeleteFilePayload
  "WATCH_DIR": WatchDirPayload
  "STOP_WATCH_DIR": StopWatchDirPayload
  "FORCE_RELOAD": ForceReloadPayload
  "VIEW_IN_EXPLORER": ViewInExplorerPayload
  "CREATE_DIR": CreateDirPayload
  "DELETE_DIR": DeleteDirPayload
}
