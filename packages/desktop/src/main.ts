import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"
import fs from "fs-extra"
import path from "path"
import os from "os"

import IS_DEV from "./helpers/electron-is-dev"
import { setUpApplicationMenu } from "./menu"

let mainWindow: BrowserWindow

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

async function createWindow() {
  // Load react devtools extension
  if (IS_DEV) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err))
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
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
  mainWindow.loadURL(START_URL)

  // Open the DevTools.
  // win.webContents.openDevTools()

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

// TODO: rename to something like EXPORT_FILE
// TODO: extract some common logic to share between exporting and saving local files
ipcMain.handle(
  "SAVE_FILE",
  async (
    _event,
    payload: {
      content: string
      format: FileFormats
      name: string | undefined
    }
  ): Promise<{
    status: DialogStatus
    error: /* string | null | */ unknown /* TODO: figure out proper error typing */
  }> => {
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

ipcMain.handle("READ_FILE", async (_event, payload) => {
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

  const files: { fileName: string; content: string }[] = []

  for (const filePath of dialogRes.filePaths) {
    try {
      // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
      const content = fs.readFileSync(filePath, { encoding: "utf-8" })
      const fileName = path.basename(filePath, path.extname(filePath))
      files.push({ fileName, content })
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

// TODO: rework naming of the events/channels

ipcMain.handle("OPEN_FILE", async (_event, payload) => {
  const { filePath } = payload

  const fileExists =
    fs.pathExistsSync(filePath) && fs.lstatSync(filePath).isFile()

  if (!fileExists) {
    return {
      status: DialogStatus.ERROR,
      error: "File doesn't exists",
      data: null,
    }
  }

  try {
    // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
    const content = fs.readFileSync(filePath, { encoding: "utf-8" })
    const fileName = path.basename(filePath, path.extname(filePath))
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        file: {
          content,
          fileName,
        },
      },
    }
  } catch (error) {
    return {
      status: DialogStatus.ERROR,
      error: "An error ocurred reading the file :" + error.message,
      data: null,
    }
  }
})

// TODO: rename to SAVE_FILE after I rename the previous handler with that name
ipcMain.handle("WRITE_FILE", async (_event, payload) => {
  const { filePath, content } = payload

  const fileExists =
    fs.pathExistsSync(filePath) && fs.lstatSync(filePath).isFile()

  if (!fileExists) {
    // TODO: better handling, maybe create the file, or let the user know using a prompt to either create the file or not
    return {
      status: DialogStatus.ERROR,
      error: "File doesn't exists",
      data: null,
    }
  }

  try {
    // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
    await fs.writeFile(filePath, content)
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (error) {
    return {
      status: DialogStatus.ERROR,
      error: "An error ocurred writing to file :" + error.message,
      data: null,
    }
  }
})

ipcMain.handle(
  "CREATE_FILE",
  async (
    _event,
    payload: {
      name?: string
    } = {}
  ) => {
    const { name = undefined } = payload

    let defaultPath = path.join(os.homedir(), name ?? "")

    const filter = filters["md"]

    const dialogRes = await dialog.showSaveDialog({
      title: "Create Document",
      defaultPath,
      buttonLabel: "Create",
      filters: [filter],
    })

    const filePath = dialogRes.filePath

    if (!filePath || dialogRes.canceled === true) {
      return {
        status: DialogStatus.CANCELED,
        error: null,
        data: null,
      }
    }

    const fileExists =
      fs.pathExistsSync(filePath) && fs.lstatSync(filePath).isFile()

    try {
      // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
      await fs.writeFile(filePath, "")
      return {
        status: DialogStatus.SUCCESS,
        error: null,
        data: {
          filePath,
          overwritten: fileExists,
        },
      }
    } catch (error) {
      return {
        status: DialogStatus.ERROR,
        error: "An error ocurred writing to file :" + error.message,
        data: null,
      }
    }
  }
)

ipcMain.handle("ADD_PATH", async (_event, _payload) => {
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

  // TODO: investigate if I should use the browserWindow argument to make the dialog modal
  const dialogRes = await dialog.showOpenDialog({
    title: "Add Path",
    defaultPath,
    buttonLabel: "Select",
    properties: ["openDirectory"],
  })

  // TODO: consider making canceled and empty separate statuses
  if (dialogRes.canceled || dialogRes.filePaths.length === 0) {
    return { status: DialogStatus.CANCELED, error: null, data: null }
  }

  const dirPath = dialogRes.filePaths[0]

  return {
    status: DialogStatus.SUCCESS,
    error: null,
    data: {
      dirPath: dirPath,
      baseName: path.basename(dirPath),
    },
  }
})

type DirObject = {
  path: string
  name: string
  dirs: DirObject[]
  files: FileObject[]
}
type FileObject = { path: string; name: string }

const createDirObject = async (pathStr: string): Promise<DirObject> => {
  try {
    await fs.ensureDir(pathStr)
  } catch (error) {
    // TODO: better error handling
    console.log(error)
    throw error
  }

  const entries = fs.readdirSync(pathStr, { withFileTypes: true })

  const files: FileObject[] = []
  const dirs: DirObject[] = []

  for (let entry of entries) {
    if (entry.isFile()) {
      const filePath = path.resolve(pathStr, entry.name)
      files.push({ path: filePath, name: entry.name })
    } else if (entry.isDirectory()) {
      const dirPath = path.resolve(pathStr, entry.name)
      const newDir = await createDirObject(dirPath)
      dirs.push(newDir)
    } else {
      // skip
    }
  }

  return {
    path: pathStr,
    name: path.basename(pathStr),
    dirs,
    files,
  }
}

ipcMain.handle("GET_FILES_AT_PATH", async (_event, payload) => {
  try {
    const dirObj = await createDirObject(payload.path)
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        dirObj: dirObj,
      },
    }
  } catch (err) {
    return { status: DialogStatus.ERROR, error: err, data: null }
  }
})

type ValidatePathsObj = { path: string; name: string | null; exists: boolean }

ipcMain.handle("VALIDATE_PATHS", async (_event, payload) => {
  try {
    const dirs: ValidatePathsObj[] = []
    for (let pathStr of payload.paths) {
      // check if the path exists and is a directory
      const dirExists =
        fs.pathExistsSync(pathStr) && fs.lstatSync(pathStr).isDirectory()
      if (!dirExists) {
        dirs.push({ path: pathStr, name: null, exists: false })
        continue
      }
      dirs.push({
        path: pathStr,
        name: path.basename(pathStr),
        exists: true,
      })
    }
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        dirs,
      },
    }
  } catch (err) {
    return { status: DialogStatus.ERROR, error: err, data: null }
  }
})

ipcMain.handle("FORCE_RELOAD", async (_event, _payload) => {
  const noti = new Notification({
    title: "Database setup error",
    body: "Attempting force reload",
  })

  noti.show()

  mainWindow.webContents.reloadIgnoringCache()
})

export {}
