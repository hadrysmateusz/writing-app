import path from "path"
import fs from "fs-extra"

import { DirObjectRecursive, FileObject } from "../types"

export const createDirObjectRecursive = async (
  pathStr: string
): Promise<DirObjectRecursive> => {
  try {
    await fs.ensureDir(pathStr)
  } catch (error) {
    // TODO: better error handling
    console.log(error)
    throw error
  }

  const entries = fs.readdirSync(pathStr, { withFileTypes: true })

  const files: FileObject[] = []
  const dirs: DirObjectRecursive[] = []

  for (let entry of entries) {
    if (entry.isFile()) {
      const filePath = path.resolve(pathStr, entry.name)
      files.push({ path: filePath, name: entry.name })
    } else if (entry.isDirectory()) {
      const dirPath = path.resolve(pathStr, entry.name)
      const newDir = await createDirObjectRecursive(dirPath)
      dirs.push(newDir)
    } else {
      // skip
    }
  }

  return {
    path: pathStr,
    name: path.basename(pathStr),
    dirs,
    files,
  }
}
