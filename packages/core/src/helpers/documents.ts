import { DataStore } from "aws-amplify"

import { Document } from "../models"

export type CreateDocumentType = {
  title: string
  content: string
}

export const createDocument = async ({ title, content }: CreateDocumentType) => {
  const newDocument = await DataStore.save(
    new Document({
      title,
      content,
    })
  )
  return newDocument
}
