import { DialogStatus } from "../types"
import { createDirObjectRecursive } from "../helpers"

export const handleGetPathContents = async (_event, payload) => {
  try {
    const dirObj = createDirObjectRecursive(payload.path)
    return {
      status: DialogStatus.SUCCESS,
      error: null,
      data: {
        dirObj: dirObj,
      },
    }
  } catch (err) {
    return { status: DialogStatus.ERROR, error: err, data: null }
  }
}
