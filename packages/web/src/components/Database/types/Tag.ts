import { RxDocument, RxCollection, RxQuery } from "rxdb"

export type TagDocType = {
  /**
   * Permanent, unchanging id used to uniquely identify a tag
   */
  id: string
  /**
   * User-facing, editable name for display purposes
   */
  name: string
  /**
   * A specially formatted name used for things like sorting and preventing duplicates
   */
  nameSlug: string
}

export type TagDocMethods = {}

export type TagDoc = RxDocument<TagDocType, TagDocMethods>

export type TagCollectionMethods = {
  findNotRemoved: () => RxQuery<
    TagDocType,
    RxDocument<TagDocType, TagDocMethods>[]
  >
  findOneNotRemoved: () => RxQuery<
    TagDocType,
    RxDocument<TagDocType, TagDocMethods>
  >
}

export type TagCollection = RxCollection<
  TagDocType,
  TagDocMethods,
  TagCollectionMethods
>
