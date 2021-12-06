import fs from "fs-extra"

import { DialogStatus } from "../types"
import { readFileForLocalEditor } from "../helpers"

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
