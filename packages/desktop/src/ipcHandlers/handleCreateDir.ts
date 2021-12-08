import { dialog, Notification } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { DialogStatus } from "../types"

export const handleCreateDir = async (
  _event,
  payload: {
    name: string
    parentPath?: string
  }
) => {
  let { name, parentPath } = payload

  console.log("create dir handler", payload)

  // TODO: accept an 'overload' without providing a path which would then ask the user for the path using a dialog
  if (!parentPath) {
    const dialogRes = await dialog.showOpenDialog({
      title: "Choose Where",
      defaultPath: os.homedir(), // TODO: better default
      buttonLabel: "OK",
      properties: ["openDirectory"],
    })
    if (dialogRes.canceled) {
      return {
        status: DialogStatus.CANCELED,
        error: null,
        data: null,
      }
    } else if (!dialogRes.filePaths[0]) {
      return {
        status: DialogStatus.ERROR,
        error: "An error ocurred creating a dir: No file path chosen",
        data: null,
      }
    } else {
      parentPath = dialogRes.filePaths[0]
    }
  }

  const dirPath = path.join(parentPath, name)

  const pathExists = fs.pathExistsSync(dirPath)

  if (pathExists) {
    const noti = new Notification({
      title: "Folder already exists",
    })
    noti.show()
    return {
      status: DialogStatus.CANCELED,
      error: null,
      data: null,
    }
  }

  try {
    fs.mkdirSync(dirPath)

    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: null,
    }
  } catch (error) {
    return {
      status: DialogStatus.ERROR,
      error: "An error ocurred creating a dir:" + error.message,
      data: null,
    }
  }
}
