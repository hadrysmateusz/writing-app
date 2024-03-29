import { dialog } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { AddPathPayload, IpcResponseStatus } from "shared"

export const handleAddPath = async (_event, payload: AddPathPayload) => {
  // TODO: better default path
  // TODO: maybe save the last used path for later
  const { defaultPath = os.homedir() } = payload

  await fs.ensureDir(defaultPath)

  // TODO: investigate if I should use the browserWindow argument to make the dialog modal
  const dialogRes = await dialog.showOpenDialog({
    title: "Add Path",
    defaultPath,
    buttonLabel: "Select",
    properties: ["openDirectory"],
  })

  // TODO: consider making canceled and empty separate statuses
  if (dialogRes.canceled || dialogRes.filePaths.length === 0) {
    return { status: IpcResponseStatus.CANCELED, error: null, data: null }
  }

  const dirPath = dialogRes.filePaths[0]

  return {
    status: IpcResponseStatus.SUCCESS,
    error: null,
    data: {
      dirPath: dirPath,
      baseName: path.basename(dirPath),
    },
  }
}
