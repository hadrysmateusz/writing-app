import { RxDocument, RxCollection } from "rxdb"

export type GroupDocType = {
  id: string
  name: string
  /**
   * Id of the group this group belongs to
   *
   * Used for nesting groups
   */
  parentGroup: string | null
  /**
   * Position among other groups in the same parent group
   */
  position: string
}

export type GroupDocMethods = {}

export type GroupDoc = RxDocument<GroupDocType, GroupDocMethods>

export type GroupCollectionMethods = {}

export type GroupCollection = RxCollection<
  GroupDocType,
  GroupDocMethods,
  GroupCollectionMethods
>
