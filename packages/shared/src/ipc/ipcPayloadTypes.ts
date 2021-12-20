import { FileObject, SupportedResourceTypes } from ".."
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
export type WatchDirResPayload = WatchDirResFilePayload | WatchDirResDirPayload
type WatcherFileEvent = "add" | "unlink"
type WatcherDirEvent = "addDir" | "unlinkDir"
type WatchDirResCommon = {
  watchedDirPath: string
  parentDirPathArr: string[]
}
type WatchDirResFilePayload = WatchDirResCommon & {
  resourceType: SupportedResourceTypes.file
  eventType: WatcherFileEvent
  file: FileObject
}
type WatchDirResDirPayload = WatchDirResCommon & {
  resourceType: SupportedResourceTypes.dir
  eventType: WatcherDirEvent
  dirTree: DirObjectRecursive
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
