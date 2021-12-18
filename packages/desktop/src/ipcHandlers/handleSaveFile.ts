import fs from "fs-extra"

import { IpcResponseStatus, SaveFilePayload } from "shared"

export const handleSaveFile = async (_event, payload: SaveFilePayload) => {
  const { filePath, content } = payload

  const fileExists =
    fs.pathExistsSync(filePath) && fs.lstatSync(filePath).isFile()

  if (!fileExists) {
    // TODO: better handling, maybe create the file, or let the user know using a prompt to either create the file or not
    return {
      status: IpcResponseStatus.ERROR,
      error: "File doesn't exists",
      data: null,
    }
  }
  try {
    // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
    await fs.writeFile(filePath, content)
    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (error) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "An error ocurred writing to file :" + error.message,
      data: null,
    }
  }
}
