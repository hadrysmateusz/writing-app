import { MyDatabase } from "../types"

import { createGroupPreRemoveHook } from "../models/Group"
import { createDocumentPreSaveHook } from "../models/Document"
import { createTagPreRemoveHook } from "../models/Tag"

export const setUpDbHooks = (db: MyDatabase) => {
  db.groups.preRemove(createGroupPreRemoveHook(db), false)
  db.documents.preSave(createDocumentPreSaveHook(), false)
  db.tags.preRemove(createTagPreRemoveHook(db), false)
}

export default setUpDbHooks
