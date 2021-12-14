import { RxJsonSchema } from "rxdb"

import { DocumentDocType } from "./types"

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
