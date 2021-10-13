import { RxJsonSchema } from "rxdb"

import { GroupDocType, MyDatabase } from "../types"

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

// Hook to remove nested groups and documents when a group is removed
export const createGroupPreInsertHook = (db: MyDatabase) => async (
  groupData
) => {
  // Because the listeners are filed only after all hooks run, we await on all async actions to avoid de-sync issues
  // TODO: try moving all promises into a single Promise.all to parallelize for possible performance gains

  // Find all documents that are a direct child of this group
  const documents = await db.documents
    .find()
    .where("parentGroup")
    .eq(groupData.id)
    .exec()

  // Remove all children that are the child of this group.
  await Promise.all(
    documents.map(async (doc) => {
      try {
        doc.softRemove()
      } catch (error) {
        console.log(error)
      }
    })
  )

  // Find all groups that are a direct child of this group
  const groups = await db.groups
    .find()
    .where("parentGroup")
    .eq(groupData.id)
    .exec()

  // Remove all child groups (which should also trigger the hook to remove all nested docs)
  await Promise.all(groups.map((doc) => doc.remove()))
}
