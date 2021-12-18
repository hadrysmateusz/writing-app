// ===== helper types

import { IpcResponseObject } from "./ipcMiscTypes"
import { DirObjectRecursive, OpenFileObject, ValidatePathsObj } from "../types"

// ===== return types

export type ExportFileResponseData = {}

export type ImportFileResponseData = {
  files: OpenFileObject[]
}

export type OpenFileResponseData = {
  file: OpenFileObject
}

export type SaveFileResponseData = {}

export type CreateFileResponseData = {
  filePath: string
  overwritten: boolean
}

export type DeleteFileResponseData = {}

export type CreateDirResponseData = {}

export type DeleteDirResponseData = {}

export type ViewInExplorerResponseData = {}

export type AddPathResponseData = {
  dirPath: string
  baseName: string
}

export type GetPathContentsResponseData = {
  dirObj: DirObjectRecursive
}

export type WatchDirResponseData = {}

export type StopWatchDirResponseData = {}

export type ValidatePathsResponseData = {
  dirs: ValidatePathsObj[]
}

export type ForceReloadResponseData = {}

// ===== full response objects

export type ExportFileResponseObject = IpcResponseObject<ExportFileResponseData>

export type ImportFileResponseObject = IpcResponseObject<ImportFileResponseData>

export type OpenFileResponseObject = IpcResponseObject<OpenFileResponseData>

export type SaveFileResponseObject = IpcResponseObject<SaveFileResponseData>

export type CreateFileResponseObject = IpcResponseObject<CreateFileResponseData>

export type DeleteFileResponseObject = IpcResponseObject<DeleteFileResponseData>

export type CreateDirResponseObject = IpcResponseObject<CreateDirResponseData>

export type DeleteDirResponseObject = IpcResponseObject<DeleteDirResponseData>

export type ViewInExplorerResponseObject =
  IpcResponseObject<ViewInExplorerResponseData>

export type AddPathResponseObject = IpcResponseObject<AddPathResponseData>

export type GetPathContentsResponseObject =
  IpcResponseObject<GetPathContentsResponseData>

export type WatchDirResponseObject = IpcResponseObject<WatchDirResponseData>

export type StopWatchDirResponseObject =
  IpcResponseObject<StopWatchDirResponseData>

export type ValidatePathsResponseObject =
  IpcResponseObject<ValidatePathsResponseData>

export type ForceReloadResponseObject =
  IpcResponseObject<ForceReloadResponseData>

// map of msg channels to response types

export type IpcResponseTypes = {
  // main->renderer // TODO: figure out how to better handle main->renderer messages
  "NEW_CLOUD_DOCUMENT": {}
  "WATCH_DIR:RES": {}
  // renderer->main
  "EXPORT_FILE": ExportFileResponseObject
  "IMPORT_FILE": ImportFileResponseObject
  "ADD_PATH": AddPathResponseObject
  "GET_PATH_CONTENTS": GetPathContentsResponseObject
  "VALIDATE_PATHS": ValidatePathsResponseObject
  "OPEN_FILE": OpenFileResponseObject
  "SAVE_FILE": SaveFileResponseObject
  "CREATE_FILE": CreateFileResponseObject
  "DELETE_FILE": DeleteFileResponseObject
  "WATCH_DIR": WatchDirResponseObject
  "STOP_WATCH_DIR": StopWatchDirResponseObject
  "FORCE_RELOAD": ForceReloadResponseObject
  "VIEW_IN_EXPLORER": ViewInExplorerResponseObject
  "CREATE_DIR": CreateDirResponseObject
  "DELETE_DIR": DeleteDirResponseObject
}
