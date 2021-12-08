import mime from "mime-types"

export const ALLOWED_DOCUMENT_FILE_TYPES = ["text/markdown"]

export const fileTypeIsAllowedDocumentType = (filePath: string) => {
  const fileType = mime.lookup(filePath)
  // console.log("FILE TYPE:", fileType)
  return ALLOWED_DOCUMENT_FILE_TYPES.includes(fileType)
}
