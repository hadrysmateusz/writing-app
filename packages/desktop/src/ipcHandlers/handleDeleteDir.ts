import rimraf from "rimraf"

import { DialogStatus } from "../types"

export const handleDeleteDir = async (
  _event,
  payload: {
    dirPath: string
  }
) => {
  const { dirPath } = payload

  console.log("delete dir handler", payload)

  // TODO: probably add some sort of user confirmation if dir is not empty

  try {
    rimraf.sync(dirPath)
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {},
    }
  } catch (error) {
    return {
      status: DialogStatus.ERROR,
      error: "An error ocurred deleting dir :" + error.message,
      data: null,
    }
  }
}
