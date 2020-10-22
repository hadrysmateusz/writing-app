import { RxJsonSchema } from "rxdb"

import { DocumentDocType } from "../types"

export const documentSchema: RxJsonSchema<DocumentDocType> = {
  title: "document schema",
  description: "describes a document",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
      final: true,
    },
    title: {
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
  },
  // TODO: make sure all fields that should be are marked as required
  required: [
    "title",
    "content",
    "parentGroup",
    "createdAt",
    "modifiedAt",
    "isDeleted",
    "isFavorite",
  ],
  indexes: ["modifiedAt", "title"],
}