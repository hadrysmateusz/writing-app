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
    tabs: {
      type: "object",
      properties: {
        currentTab: { type: ["string", "null"] },
        tabs: {
          type: "object",
          additionalItems: true,
        },
      },
    },
    primarySidebarCurrentView: {
      type: "string",
    },
    primarySidebarCurrentSubviews: {
      type: "object",
      properties: {
        cloud: { type: "string" },
        local: { type: "string" },
        snippets: { type: "string" },
      },
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
