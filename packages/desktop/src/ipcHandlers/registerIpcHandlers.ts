import { ipcMain } from "electron"

import { handleViewInExplorer } from "./handleViewInExplorer"
import { handleDeleteFile } from "./handleDeleteFile"
import { handleDeleteDir } from "./handleDeleteDir"
import { handleCreateDir } from "./handleCreateDir"
import { handleWatchDir } from "./handleWatchDir"
import { handleSaveFile } from "./handleSaveFile"
import { handleValidatePaths } from "./handleValidatePaths"
import { handleStopWatchDir } from "./handleStopWatchDir"
import { handleExportFile } from "./handleExportFile"
import { handleImportFile } from "./handleImportFile"
import { handleOpenFile } from "./handleOpenFile"
import { handleGetPathContents } from "./handleGetPathContents"
import { handleForceReload } from "./handleForceReload"
import { handleCreateFile } from "./handleCreateFile"
import { handleAddPath } from "./handleAddPath"

export const registerIpcHandlers = () => {
  ipcMain.handle("EXPORT_FILE", handleExportFile)
  ipcMain.handle("IMPORT_FILE", handleImportFile)

  ipcMain.handle("OPEN_FILE", handleOpenFile)
  ipcMain.handle("SAVE_FILE", handleSaveFile)

  ipcMain.handle("CREATE_FILE", handleCreateFile)
  ipcMain.handle("DELETE_FILE", handleDeleteFile)

  ipcMain.handle("CREATE_DIR", handleCreateDir)
  ipcMain.handle("DELETE_DIR", handleDeleteDir)

  ipcMain.handle("VIEW_IN_EXPLORER", handleViewInExplorer)

  ipcMain.handle("ADD_PATH", handleAddPath)

  ipcMain.handle("GET_PATH_CONTENTS", handleGetPathContents)

  ipcMain.handle("WATCH_DIR", handleWatchDir)
  ipcMain.handle("STOP_WATCH_DIR", handleStopWatchDir)

  ipcMain.handle("VALIDATE_PATHS", handleValidatePaths)

  ipcMain.handle("FORCE_RELOAD", handleForceReload)
}

export default registerIpcHandlers
