import { GetPathContentsPayload, IpcResponseStatus } from "shared"

import { createDirObjectRecursive } from "../helpers"

export const handleGetPathContents = async (
  _event,
  payload: GetPathContentsPayload
) => {
  try {
    const dirObj = createDirObjectRecursive(payload.path)
    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {
        dirObj: dirObj,
      },
    }
  } catch (err) {
    return { status: IpcResponseStatus.ERROR, error: err, data: null }
  }
}
