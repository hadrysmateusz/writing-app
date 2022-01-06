import { app, BrowserWindow, Notification } from "electron"
import path from "path"

import { setUpApplicationMenu } from "./menu"
import { APP_NAME, START_URL } from "./constants"
import {
  closeWatcherForDir,
  getDirWatchers,
  getMainWindow,
  IS_DEV,
} from "./helpers"
import { WatcherUnsubObj } from "./types"
import registerIpcHandlers from "./ipcHandlers/registerIpcHandlers"

declare global {
  var mainWindow: BrowserWindow | undefined
  var dirWatchers: Record<string, WatcherUnsubObj> | undefined
}

async function createWindow() {
  // Load react devtools extension
  if (IS_DEV) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer")

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

  getMainWindow().on("close", (_event) => {
    // TODO: remove this notification when I'm sure the watcher removal works
    const noti = new Notification({
      title: "Closed window",
      body: "Cancelling watchers",
    })
    noti.show()

    // TODO: make sure this works
    for (let dirPath of Object.keys(getDirWatchers())) {
      closeWatcherForDir(dirPath)
    }
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

registerIpcHandlers()

export {}
