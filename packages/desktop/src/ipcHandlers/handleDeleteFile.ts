import fs from "fs-extra"

import { DialogStatus } from "../types"

export const handleDeleteFile = (_event, payload) => {
  const { targetPath }: { targetPath: string } = payload
  if (!fs.pathExistsSync(targetPath)) {
    return { status: DialogStatus.ERROR, error: "File doesn't exist" }
  }
  try {
    fs.unlinkSync(targetPath)
    return { status: DialogStatus.SUCCESS, data: null, error: null }
  } catch (err) {
    return { status: DialogStatus.ERROR, error: err, data: null }
  }
}
