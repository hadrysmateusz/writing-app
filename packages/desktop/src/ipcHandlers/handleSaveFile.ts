import fs from "fs-extra"

import { DialogStatus } from "../types"

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
