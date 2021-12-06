import { dialog, shell, Notification } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"
import chokidar from "chokidar"

import {
  ValidatePathsObj,
  FileFormats,
  DialogStatus,
  OpenFileObject,
} from "./types"
import {
  closeWatcherForDir,
  createDirObjectRecursive,
  getDirWatchers,
} from "./helpers"
import { APP_NAME, filters } from "./constants"
import { getMainWindow } from "./helpers"
import { readFileForLocalEditor } from "./io"

export const handleExportFile = async (
  _event,
  payload: {
    content: string
    format: FileFormats
    name: string | undefined
  }
) => {
  try {
    const { content, format, name } = payload

    // TODO: better default path
    // TODO: save the last used path for later
    // TODO: consider making the path configurable in settings

    let defaultPath = path.join(os.homedir(), APP_NAME)
    const filter = filters[format]

    await fs.ensureDir(defaultPath)

    if (typeof name === "string" && name.trim() !== "") {
      defaultPath = path.join(defaultPath, `${name}.${format}`)
    }

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

    fs.writeFile(filePath, content)
    shell.showItemInFolder(filePath) // TODO: make this optional
    return { status: DialogStatus.SUCCESS, error: null }
  } catch (error) {
    console.log(error)
    return { status: DialogStatus.ERROR, error }
  }
}

export const handleImportFile = async (_event, payload) => {
  const { format } = payload

  // TODO: better default path
  // TODO: save the last used path for later
  let defaultPath = path.join(os.homedir())
  const filter = filters[format]

  await fs.ensureDir(defaultPath)

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

  const files: OpenFileObject[] = []

  for (const filePath of dialogRes.filePaths) {
    try {
      const file = readFileForLocalEditor(filePath)
      files.push(file)
    } catch (error) {
      return {
        status: DialogStatus.ERROR,
        error: "An error ocurred reading the file :" + error.message,
        data: null,
      }
    }
  }

  return { status: DialogStatus.SUCCESS, error: null, data: files }
}

export const handleOpenFile = async (_event, payload) => {
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
    const file = readFileForLocalEditor(filePath)
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        file,
      },
    }
  } catch (error) {
    return {
      status: DialogStatus.ERROR,
      error: "An error ocurred reading the file :" + error.message,
      data: null,
    }
  }
}

export const handleSaveFile = async (
  _event,
  payload: {
    filePath: string
    content: string
  }
) => {
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
}

export const handleCreateFile = async (
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

export const handleAddPath = async (_event, _payload) => {
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
}

export const handleGetPathContents = async (_event, payload) => {
  try {
    const dirObj = await createDirObjectRecursive(payload.path)
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
}

export const handleWatchDir = async (
  _event,
  payload: {
    dirPath: string
  }
) => {
  try {
    const { dirPath } = payload
    console.log("main handling WATCH_DIR event")

    // TODO: ensure or just check for path

    const watcher = chokidar.watch(dirPath, {
      persistent: true,
      ignoreInitial: true,
    })

    const sendResponse = ({
      eventType,
      filePath,
    }: {
      eventType: string
      filePath: string
    }) => {
      console.log("file " + filePath + " " + eventType)
      const fileDirPath = path.dirname(filePath)
      const fileName = path.basename(filePath)

      // console.log("fileDirPath: ", fileDirPath)
      // console.log("search for: ", dirPath)
      let relativePath = fileDirPath.replace(dirPath, "")
      // console.log("relativePath: ", relativePath)

      const dirPathArr = relativePath.split(path.sep)
      // console.log("dirPathArr: ", dirPathArr)

      const actualDirPathArr = dirPathArr.map((_fragment, i, fragArr) => {
        let newActualDirPath = dirPath
        for (let j = 0; j <= i; j++) {
          newActualDirPath = path.join(newActualDirPath, fragArr[j])
          newActualDirPath = path.normalize(newActualDirPath)
        }
        return newActualDirPath
      })
      // console.log("actualDirPathArr", actualDirPathArr)

      getMainWindow().webContents.send("WATCH_DIR:RES", {
        eventType: eventType,
        dirPath,
        filePath,
        fileDirPath,
        dirPathArr: actualDirPathArr,
        fileName,
      })
    }

    const onWatcherReady = async () => {
      // TODO: refactoring
      await closeWatcherForDir(dirPath)
      getDirWatchers()[dirPath] = {
        close: watcher.close.bind(watcher),
        added: Date.now(),
      }
      console.log("saved watcher")
      console.log(getDirWatchers())
    }

    const onWatcherAdd = (path: string) => {
      sendResponse({ eventType: "add", filePath: path })
    }

    const onWatcherUnlink = (path: string) => {
      sendResponse({ eventType: "unlink", filePath: path })
    }

    watcher
      .on("ready", onWatcherReady)
      .on("add", onWatcherAdd)
      .on("unlink", onWatcherUnlink)

    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        removeWatcher: watcher.close,
      },
    }
  } catch (err) {
    console.log("Error in WATCH_DIR handler:")
    console.log(err)
    return {
      status: DialogStatus.ERROR,
      error: err,
      data: null,
    }
  }

  // TODO: handle add/unlink dir events

  // More possible events.
  // watcher
  //   .on("addDir", (path) => log(`Directory ${path} has been added`))
  //   .on("unlinkDir", (path) => log(`Directory ${path} has been removed`))
  //   .on("error", (error) => log(`Watcher error: ${error}`))
  //   .on("ready", () => log("Initial scan complete. Ready for changes"))
  // .on("change", (path) => console.log(`File ${path} has been changed`))
  // .on("error", (error) => console.log(`Watcher error: ${error}`))
}

export const handleStopWatchDir = async (
  _event,
  payload: {
    dirPath: string
    timestamp: number
  }
) => {
  const { dirPath, timestamp } = payload
  await closeWatcherForDir(dirPath, timestamp)
}

export const handleValidatePaths = async (_event, payload) => {
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
}

export const handleForceReload = async (_event, _payload) => {
  const noti = new Notification({
    title: "Database setup error",
    body: "Attempting force reload",
  })

  noti.show()

  getMainWindow().webContents.reloadIgnoringCache()
}
