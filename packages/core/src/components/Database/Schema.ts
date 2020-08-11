import { RxJsonSchema } from "rxdb"

import { DocumentDocType, GroupDocType, UserdataDocType } from "./types"

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

export const userdataSchema: RxJsonSchema<UserdataDocType> = {
  title: "userdata schema",
  description: "describes a set of user data",
  version: 0,
  type: "object",
  properties: {
    userId: {
      type: "string",
      primary: true,
      final: true,
    },
    isSpellCheckEnabled: {
      type: "boolean",
    },
  },
}
