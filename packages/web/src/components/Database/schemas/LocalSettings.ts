import { RxJsonSchema } from "rxdb"

import { LocalSettingsDocType } from "../types"

const sidebarCommon = {
  // id: { type: "string" },
  isOpen: { type: "boolean" },
  currentView: { type: "string" },
}

export const localSettingsSchema: RxJsonSchema<LocalSettingsDocType> = {
  title: "local settings schema",
  description: "describes a set of local settings",
  version: 4,
  primaryKey: "userId",
  type: "object",
  properties: {
    userId: {
      type: "string",
      final: true,
    },
    expandedKeys: {
      type: "array",
      // TODO: consider removing the uniqueItems constraint as it shouldn't be a problem and it might cause the app to crash on an improper update
      uniqueItems: true,
      items: { type: "string" },
    },
    unsyncedDocs: {
      type: "array",
      // TODO: consider removing the uniqueItems constraint as it shouldn't be a problem and it might cause the app to crash on an improper update
      uniqueItems: true,
      items: { type: "string" },
    },
    // tabs: {
    //   type: "object",
    //   properties: {
    //     currentTab: { type: ["string", "null"] },
    //     tabs: {
    //       type: "object",
    //       additionalItems: true,
    //     },
    //   },
    // },
    tabs: { type: "string" },
    // TODO: rename this to localDirPaths or something along those lines
    localDocPaths: {
      type: "array",
      uniqueItems: true,
      items: { type: "string" },
    },
    sidebars: {
      type: "object",
      properties: {
        navigator: {
          type: "object",
          properties: {
            ...sidebarCommon,
            currentPaths: {
              type: "object",
              properties: {
                default: { type: "string" },
              },
            },
          },
        },
        primary: {
          type: "object",
          properties: {
            ...sidebarCommon,
            currentPaths: {
              type: "object",
              properties: {
                cloud: { type: "string" },
                local: { type: "string" },
                tags: { type: "string" },
              },
            },
          },
        },
        secondary: {
          type: "object",
          properties: {
            ...sidebarCommon,
            currentPaths: {
              type: "object",
              properties: { stats: { type: "string" } },
            },
          },
        },
      },
    },
  },
  required: ["userId"],
}
