import { RxJsonSchema } from "rxdb"

import { DocumentDocType } from "../types"

export const documentSchema: RxJsonSchema<DocumentDocType> = {
  title: "document schema",
  description: "describes a document",
  version: 6,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      final: true,
    },
    title: {
      type: "string",
    },
    titleSlug: {
      type: "string",
    },
    content: {
      type: "string",
    },
    parentGroup: {
      type: ["string", "null"],
    },
    createdAt: {
      type: "number",
    },
    modifiedAt: {
      type: "number",
    },
    isFavorite: {
      type: "boolean",
    },
    isDeleted: {
      type: "boolean",
    },
    tags: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
      },
    },
  },
  // TODO: make sure all fields that should be are marked as required
  required: [
    "title",
    "content",
    "parentGroup",
    "createdAt",
    "modifiedAt",
    "isFavorite",
    "isDeleted",
  ],
  indexes: ["modifiedAt", "titleSlug"],
}

// Hook to update the modifiedAt field on every update
export const createDocumentPreSaveHook = () => async (data, _doc) => {
  // TODO: check for changes, if there aren't any, don't update the modifiedAt date
  data.modifiedAt = Date.now()
  data.titleSlug = `${
    data.title.trim() === "" ? "untitled" : data.title.trim().toLowerCase()
  } ${Date.now()}`.trim()
}
