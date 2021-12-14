import { RxCollectionHookCallback } from "rxdb"

import { MyDatabase } from "../../types"

import { TagDocType, TagDocMethods } from "./types"

/**
 * When deleting this tag, remove it from all documents that contain it
 */
export const createTagPreRemoveHook =
  (db: MyDatabase): RxCollectionHookCallback<TagDocType, TagDocMethods> =>
  async (tagData) => {
    // Find all documents with this tag
    const docsWithTag = await db.documents
      .find({
        selector: {
          tags: {
            $elemMatch: { $eq: tagData.id },
          },
        },
      })
      .exec()

    // Remove this tag from all found documents
    await Promise.all(
      docsWithTag.map(async (doc) => {
        return doc.update({
          $set: { tags: doc.tags.filter((tagId) => tagId !== tagData.id) },
        })
      })
    )
  }
