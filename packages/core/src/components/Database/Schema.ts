import { RxJsonSchema } from "rxdb"

import { DocumentDocType, GroupDocType } from "./types"

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
  },
  required: ["title", "content"],
}

export const groupSchema: RxJsonSchema<GroupDocType> = {
  title: "group schema",
  description: "describes a group",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true,
      final: true,
    },
    name: {
      type: "string",
    },
    parentGroup: {
      type: ["string", "null"],
    },
  },
}
