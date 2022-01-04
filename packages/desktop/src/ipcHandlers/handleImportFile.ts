import { dialog } from "electron"
import fs from "fs-extra"
import path from "path"
import os from "os"

import { ImportFilePayload, IpcResponseStatus, FileObject } from "shared"

import { filters } from "../constants"
import { readFileForLocalEditor } from "../helpers"

export const handleImportFile = async (_event, payload: ImportFilePayload) => {
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
    return { status: IpcResponseStatus.CANCELED, error: null, data: null }
  }

  const files: FileObject[] = []

  for (const filePath of dialogRes.filePaths) {
    try {
      const file = readFileForLocalEditor(filePath)
      files.push(file)
    } catch (error) {
      return {
        status: IpcResponseStatus.ERROR,
        error: "An error ocurred reading the file :" + error.message,
        data: null,
      }
    }
  }

  return { status: IpcResponseStatus.SUCCESS, error: null, data: { files } }
}
