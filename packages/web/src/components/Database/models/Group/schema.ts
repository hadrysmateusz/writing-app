import { RxJsonSchema } from "rxdb"

import { GroupDocType } from "./types"

export const groupSchema: RxJsonSchema<GroupDocType> = {
  title: "group schema",
  description: "describes a group",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
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
