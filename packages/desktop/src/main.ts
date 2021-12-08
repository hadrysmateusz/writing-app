import { app, BrowserWindow, ipcMain, shell } from "electron"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"
import path from "path"

import { setUpApplicationMenu } from "./menu"
import { WatcherUnsubObj } from "./types"
import { APP_NAME, START_URL } from "./constants"
import { getMainWindow, IS_DEV } from "./helpers"
import {
  handleAddPath,
  handleCreateFile,
  handleForceReload,
  handleGetPathContents,
  handleOpenFile,
  handleImportFile,
  handleExportFile,
  handleStopWatchDir,
  handleValidatePaths,
  handleWatchDir,
  handleSaveFile,
} from "./ipcHandlers"
import { handleViewInExplorer } from "./ipcHandlers/handleViewInExplorer"
import { handleDeleteFile } from "./ipcHandlers/handleDeleteFile"

declare global {
  var mainWindow: BrowserWindow | undefined
  var dirWatchers: Record<string, WatcherUnsubObj> | undefined
}

async function createWindow() {
  // Load react devtools extension
  if (IS_DEV) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
  }

  // Create the browser window.
  global.mainWindow = new BrowserWindow({
    width: 1900,
    height: 1020,
    minWidth: 300, // The minWidth shouldn't be too high because it would prevent multi-tasking on most screens
    minHeight: 600,
    title: APP_NAME,
    // frame: false,
    acceptFirstMouse: true,
    backgroundColor: "#131313",
    webPreferences: {
      // devTools: false, TODO: consider setting this in prod to prevent opening the devtools
      // TODO: this might not be needed - more research required
      // https://www.electronjs.org/docs/tutorial/security#15-disable-the-remote-module
      // enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  // and load the index.html of the app.
  getMainWindow().loadURL(START_URL)

  // Open the DevTools.
  getMainWindow().webContents.openDevTools()

  // Set up application menu
  setUpApplicationMenu()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// TODO: add simple reveal in explorer action

ipcMain.handle("EXPORT_FILE", handleExportFile)
ipcMain.handle("IMPORT_FILE", handleImportFile)

ipcMain.handle("OPEN_FILE", handleOpenFile)
ipcMain.handle("SAVE_FILE", handleSaveFile)

ipcMain.handle("CREATE_FILE", handleCreateFile)
ipcMain.handle("DELETE_FILE", handleDeleteFile)

ipcMain.handle("VIEW_IN_EXPLORER", handleViewInExplorer)

ipcMain.handle("ADD_PATH", handleAddPath)

ipcMain.handle("GET_PATH_CONTENTS", handleGetPathContents)

ipcMain.handle("WATCH_DIR", handleWatchDir)
ipcMain.handle("STOP_WATCH_DIR", handleStopWatchDir)

ipcMain.handle("VALIDATE_PATHS", handleValidatePaths)

ipcMain.handle("FORCE_RELOAD", handleForceReload)

export {}
