import { shell } from "electron"
import fs from "fs-extra"

import { ViewInExplorerPayload } from "shared"

import { IpcResponseStatus } from "../types"

export const handleViewInExplorer = (
  _event,
  payload: ViewInExplorerPayload
) => {
  const { targetPath } = payload
  if (!fs.pathExistsSync(targetPath)) {
    return {
      status: IpcResponseStatus.ERROR,
      error: "File/Dir doesn't exist",
      data: null,
    }
  }
  shell.showItemInFolder(targetPath)
  return { status: IpcResponseStatus.SUCCESS, error: null, data: {} }
}
