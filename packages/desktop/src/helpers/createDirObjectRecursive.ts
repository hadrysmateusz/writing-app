import path from "path"
import fs from "fs-extra"

import { DirObjectRecursive, FileObject, SupportedResourceTypes } from "shared"

import { fileTypeIsAllowedDocumentType } from "./fileTypeIsAllowedDocumentType"
import { getResourceType } from "./getResourceType"
import { readFileContentForLocalEditor } from "./io"

export const createDirObjectRecursive = (
  pathStr: string
): DirObjectRecursive => {
  fs.ensureDirSync(pathStr)

  const entries = fs.readdirSync(pathStr, { withFileTypes: true })

  const files: FileObject[] = []
  const dirs: DirObjectRecursive[] = []

  for (let entry of entries) {
    if (entry.isFile()) {
      const fileObject = createFileObject(pathStr, entry.name)
      if (!fileObject) continue
      files.push(fileObject)
    } else if (entry.isDirectory()) {
      const dirPath = path.resolve(pathStr, entry.name)
      const newDir = createDirObjectRecursive(dirPath)
      dirs.push(newDir)
    }
  }

  return {
    path: pathStr,
    name: path.basename(pathStr),
    parentDirectory: path.resolve(pathStr, ".."),
    dirs,
    files,
  }
}

// TODO: make this function accept just a path string like createDirObjectRecursive and infer the values of parentDirPath and resourceName inside
export const createFileObject = (
  parentDirPath: string,
  resourceName: string
): FileObject | null => {
  const filePath = path.resolve(parentDirPath, resourceName)

  if (!fileTypeIsAllowedDocumentType(filePath)) {
    return null
  }

  const stats = fs.statSync(filePath)

  const resourceType = getResourceType(stats)

  if (resourceType !== SupportedResourceTypes.file) {
    console.log("Invalid resource type")
    return null
  }

  const fileContent = readFileContentForLocalEditor(filePath)

  return {
    path: filePath,
    name: resourceName,
    createdAt: stats.ctime,
    modifiedAt: stats.mtime,
    parentDirectory: parentDirPath,
    content: fileContent,
  }
}
