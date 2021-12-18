import fs from "fs-extra"

import { OpenFilePayload } from "shared"

import { IpcResponseStatus } from "../types"
import { readFileForLocalEditor } from "../helpers"

export const handleOpenFile = async (_event, payload: OpenFilePayload) => {
  const { filePath } = payload

  // TODO: prevent opening files other than markdown (if it's a file type like txt or html or doc, meaning formats supported (or that will soon be supported) by cloud editors, prompt to import instead, if not then filter them out of sidebar lists and display a message box saying this file is not supported if one gets opened somehow anyway)

  const fileExists =
    fs.pathExistsSync(filePath) && fs.lstatSync(filePath).isFile()

  if (!fileExists) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "File doesn't exists",
      data: null,
    }
  }

  try {
    const file = readFileForLocalEditor(filePath)
    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {
        file,
      },
    }
  } catch (error) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "An error ocurred reading the file :" + error.message,
      data: null,
    }
  }
}
