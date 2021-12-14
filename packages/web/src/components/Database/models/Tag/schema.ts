import { RxJsonSchema } from "rxdb"

import { TagDocType } from "./types"

export const tagSchema: RxJsonSchema<TagDocType> = {
  title: "tag schema",
  description: "describes a tag",
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
    nameSlug: {
      type: "string",
    },
  },
  required: ["name"],
  indexes: ["nameSlug"],
}
