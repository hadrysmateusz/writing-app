import { RxJsonSchema } from "rxdb"

import { LocalSettingsDocType } from "../types"

export const localSettingsSchema: RxJsonSchema<LocalSettingsDocType> = {
  title: "local settings schema",
  description: "describes a set of local settings",
  version: 1,
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
    unsyncedDocs: {
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
    primarySidebarIsOpen: {
      type: "boolean",
    },
    secondarySidebarIsOpen: {
      type: "boolean",
    },
    navigatorSidebarIsOpen: {
      type: "boolean",
    },
  },
  required: ["userId"],
}
