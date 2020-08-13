import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import IS_DEV from "./helpers/electron-is-dev"
import { setUpApplicationMenu } from "./menu"

const APP_NAME = "writing-tool" // TODO: move to shared constants file and replace all current uses

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

const START_URL = IS_DEV
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "web/index.html")}`

const filters = {
  md: { name: "Markdown", extensions: ["md"] },
  html: { name: "HTML", extensions: ["html", "htm"] },
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1850,
    height: 1150,
    minWidth: 980,
    title: APP_NAME,
    // devTools: false, TODO: consider setting this in prod to prevent opening the devtools
    // frame: false,
    acceptFirstMouse: true,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      nodeIntegration: false,
      // TODO: this might not be needed - more research required
      // https://www.electronjs.org/docs/tutorial/security#15-disable-the-remote-module
      enableRemoteModule: false,
      preload: __dirname + "/preload.js",
    },
  })

  // and load the index.html of the app.
  win.loadURL(START_URL)

  // Open the DevTools.
  win.webContents.openDevTools()

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

ipcMain.handle(
  "save-file",
  async (
    _event,
    payload: {
      content: string
      format: FileFormats
      name: string | undefined
    }
  ): Promise<{ status: DialogStatus; error: string | null }> => {
    // TODO: make sure the event can be trusted

    const { content, format, name } = payload

    // TODO: better default path
    // TODO: save the last used path for later
    // TODO: consider making the path configurable in settings

    let defaultPath = path.join(os.homedir(), APP_NAME)

    try {
      await fs.ensureDir(defaultPath)
    } catch (error) {
      // TODO: better error handling
      console.log(error)
      throw error
    }

    if (typeof name === "string" && name.trim() !== "") {
      defaultPath = path.join(defaultPath, `${name}.${format}`)
    }

    const filter = filters[format]

    // TODO: investigate if I should use the browserWindow argument to make the dialog modal
    const file = await dialog.showSaveDialog({
      title: "Export", // TODO: a better title
      defaultPath,
      buttonLabel: "Export",
      filters: [filter],
      properties: ["showOverwriteConfirmation"],
    })

    if (file.canceled) {
      return { status: DialogStatus.CANCELED, error: null }
    }

    // filePath is always string if the dialog wasn't cancelled
    const filePath = file.filePath as string

    try {
      fs.writeFile(filePath, content)
      shell.showItemInFolder(filePath) // TODO: make this optional
      return { status: DialogStatus.SUCCESS, error: null }
    } catch (error) {
      console.log(error)
      return { status: DialogStatus.ERROR, error }
    }
  }
)

ipcMain.handle("read-file", async (_event, payload) => {
  const { format } = payload

  // TODO: better default path
  // TODO: save the last used path for later
  let defaultPath = path.join(os.homedir())

  try {
    await fs.ensureDir(defaultPath)
  } catch (error) {
    // TODO: better error handling
    console.log(error)
    throw error
  }

  const filter = filters[format]

  // TODO: investigate if I should use the browserWindow argument to make the dialog modal
  const dialogRes = await dialog.showOpenDialog({
    title: "Import",
    defaultPath,
    buttonLabel: "Import",
    filters: [filter],
    properties: ["openFile", "multiSelections"],
  })

  // TODO: consider making canceled and empty separate statuses
  if (dialogRes.canceled || dialogRes.filePaths.length === 0) {
    return { status: DialogStatus.CANCELED, error: null, data: null }
  }

  const files = []

  for (const filePath of dialogRes.filePaths) {
    try {
      // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
      const data = fs.readFileSync(filePath, { encoding: "utf-8" })
      files.push(data)
    } catch (error) {
      return {
        status: DialogStatus.ERROR,
        error: "An error ocurred reading the file :" + error.message,
        data: null,
      }
    }
  }

  return { status: DialogStatus.SUCCESS, error: null, data: files }
})

export {}
