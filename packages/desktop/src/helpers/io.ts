import fs from "fs-extra"
import path from "path"
import { OpenFileObject } from "shared"

export const readFileForLocalEditor = (filePath: string): OpenFileObject => {
  // TODO: investigate different encodings and flags - do I need to do more to make this work with all files
  const content = readFileContentForLocalEditor(filePath)
  const name = path.basename(filePath, path.extname(filePath))
  const file: OpenFileObject = {
    content,
    name,
  }
  return file
}

export const readFileContentForLocalEditor = (filePath: string): string => {
  return fs.readFileSync(filePath, { encoding: "utf-8" })
}
