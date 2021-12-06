import { dialog } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { DialogStatus } from "../types"

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
