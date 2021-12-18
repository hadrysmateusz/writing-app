import fs from "fs-extra"
import path from "path"

import { ValidatePathsPayload } from "shared"

import { ValidatePathsObj, IpcResponseStatus } from "../types"

export const handleValidatePaths = async (
  _event,
  payload: ValidatePathsPayload
) => {
  try {
    const dirs: ValidatePathsObj[] = []
    for (let pathStr of payload.paths) {
      // check if the path exists and is a directory
      const dirExists =
        fs.pathExistsSync(pathStr) && fs.lstatSync(pathStr).isDirectory()
      if (!dirExists) {
        dirs.push({ path: pathStr, name: null, exists: false })
        continue
      }
      dirs.push({
        path: pathStr,
        name: path.basename(pathStr),
        exists: true,
      })
    }
    return {
      status: IpcResponseStatus.SUCCESS,
      error: null,
      data: {
        dirs,
      },
    }
  } catch (err) {
    return { status: IpcResponseStatus.ERROR, error: err, data: null }
  }
}
