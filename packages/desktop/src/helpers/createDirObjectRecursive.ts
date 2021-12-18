import path from "path"
import fs from "fs-extra"

import { DirObjectRecursive, FileObject } from "shared"

import { fileTypeIsAllowedDocumentType } from "./fileTypeIsAllowedDocumentType"

export const createDirObjectRecursive = (
  pathStr: string
): DirObjectRecursive => {
  fs.ensureDirSync(pathStr)

  const entries = fs.readdirSync(pathStr, { withFileTypes: true })

  const files: FileObject[] = []
  const dirs: DirObjectRecursive[] = []

  for (let entry of entries) {
    if (entry.isFile()) {
      const filePath = path.resolve(pathStr, entry.name)
      if (!fileTypeIsAllowedDocumentType(filePath)) {
        continue
      }
      files.push({ path: filePath, name: entry.name })
    } else if (entry.isDirectory()) {
      const dirPath = path.resolve(pathStr, entry.name)
      const newDir = createDirObjectRecursive(dirPath)
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
