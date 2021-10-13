import { RxJsonSchema } from "rxdb"

import { UserdataDocType } from "../types"

export const userdataSchema: RxJsonSchema<UserdataDocType> = {
  title: "userdata schema",
  description: "describes a set of user data",
  version: 0,
  primaryKey: "userId",
  type: "object",
  properties: {
    userId: {
      type: "string",
      final: true,
    },
    isSpellCheckEnabled: {
      type: "boolean",
    },
  },
}
