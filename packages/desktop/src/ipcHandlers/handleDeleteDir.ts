import rimraf from "rimraf"

import { DeleteDirPayload } from "shared"

import { IpcResponseStatus } from "../types"

export const handleDeleteDir = async (_event, payload: DeleteDirPayload) => {
  const { dirPath } = payload

  console.log("delete dir handler", payload)

  // TODO: probably add some sort of user confirmation if dir is not empty

  try {
    rimraf.sync(dirPath)
    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (error) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "An error ocurred deleting dir :" + error.message,
      data: null,
    }
  }
}
