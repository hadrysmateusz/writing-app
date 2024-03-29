import { dialog } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { CreateFilePayload, IpcResponseStatus } from "shared"

import { filters } from "../constants"

export const handleCreateFile = async (
  _event,
  payload: CreateFilePayload = {}
) => {
  const {
    name = undefined,
    defaultPath = path.join(os.homedir(), name ?? ""),
  } = payload

  console.log("create file handler")
  console.log("handleCreateFile", name, defaultPath, payload)

  fs.ensureDir(defaultPath)

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
      status: IpcResponseStatus.CANCELED,
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
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {
        filePath,
        overwritten: fileExists,
      },
    }
  } catch (error) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "An error ocurred writing to file :" + error.message,
      data: null,
    }
  }
}
