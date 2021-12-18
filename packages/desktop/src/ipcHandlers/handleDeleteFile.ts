import fs from "fs-extra"

import { DeleteFilePayload } from "shared"

import { IpcResponseStatus } from "../types"

export const handleDeleteFile = (_event, payload: DeleteFilePayload) => {
  const { targetPath } = payload
  if (!fs.pathExistsSync(targetPath)) {
    return { status: IpcResponseStatus.ERROR, error: "File doesn't exist" }
  }
  try {
    fs.unlinkSync(targetPath)
    return { status: IpcResponseStatus.SUCCESS, data: {}, error: null }
  } catch (err) {
    return { status: IpcResponseStatus.ERROR, error: err, data: null }
  }
}
