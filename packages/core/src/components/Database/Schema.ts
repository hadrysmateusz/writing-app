import { RxJsonSchema } from "rxdb"

import {
  DocumentDocType,
  GroupDocType,
  LocalSettingsDocType,
  UserdataDocType,
} from "./types"

// TODO: move each schema to separate file

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
    position: {
      type: "string",
    },
  },
  required: ["name", "parentGroup", "position"],
  indexes: ["position", "name"],
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

export const localSettingsSchema: RxJsonSchema<LocalSettingsDocType> = {
  title: "local settings schema",
  description: "describes a set of local settings",
  version: 0,
  type: "object",
  properties: {
    userId: {
      type: "string",
      primary: true,
      final: true,
    },
    expandedKeys: {
      type: "array",
      // TODO: consider removing the uniqueItems constraint as it shouldn't be a problem and it might cause the app to crash on an improper update
      uniqueItems: true,
      items: {
        type: "string",
      },
    },
    currentEditor: {
      type: ["string", "null"],
    },
    primarySidebarCurrentView: {
      type: "string",
    },
    secondarySidebarCurrentView: {
      type: "string",
    },
  },
  required: ["userId"],
}
