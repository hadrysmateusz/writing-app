import path from "path"
import fs from "fs-extra"
import mime from "mime-types"

import { DirObjectRecursive, FileObject } from "../types"

export const ALLOWED_DOCUMENT_FILE_TYPES = ["text/markdown"]

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
      const fileType = mime.lookup(filePath)
      // console.log("FILE TYPE:", fileType)
      if (!ALLOWED_DOCUMENT_FILE_TYPES.includes(fileType)) {
        continue
      }
      files.push({ path: filePath, name: entry.name })
    } else if (entry.isDirectory()) {
      const dirPath = path.resolve(pathStr, entry.name)
      const newDir = await createDirObjectRecursive(dirPath)
      dirs.push(newDir)
    }
  }

  return {
    path: pathStr,
    name: path.basename(pathStr),
    dirs,
    files,
  }
}
