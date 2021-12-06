import { shell } from "electron"
import fs from "fs-extra"

import { DialogStatus } from "../types"

export const handleViewInExplorer = (_event, payload) => {
  const { targetPath }: { targetPath: string } = payload
  if (!fs.pathExistsSync(targetPath)) {
    return { status: DialogStatus.ERROR, error: "File/Dir doesn't exist" }
  }
  shell.showItemInFolder(targetPath)
  return { status: DialogStatus.SUCCESS }
}
