import { RxDatabase, RxDocument, RxCollection, RxQuery } from "rxdb"

//#region Document

export type DocumentDocType = {
  /**
   * Permanent, unchanging id used to uniquely identify a document
   */
  id: string
  /**
   * Title of the document used for display and publishing purposes
   *
   * @todo consider renaming this property to "name" for parity with
   * groups and to make better sense for non-article documents
   */
  title: string
  /**
   * Serialized document content
   */
  content: string
  /**
   * Id of the group this document belongs to
   *
   * Named "parentGroup" for parity with groups
   *
   * @todo handle top-level documents that aren't a part of any group
   */
  parentGroup: string | null
  /**
   * Timestamp of when the document was originally created
   */
  createdAt: number
  /**
   * Timestamp of when the document was last modified
   */
  modifiedAt: number
  /**
   * Whether the document should appear in the favorites view (whatever it ends up being called)
   */
  isFavorite: boolean
  /**
   * Whether the document was deleted and should only appear in trash
   */
  isDeleted: boolean
}

export type DocumentDocMethods = {
  softRemove: () => void
}

export type DocumentDoc = RxDocument<DocumentDocType, DocumentDocMethods>

export type DocumentCollectionMethods = {
  findNotRemoved: () => RxQuery<
    DocumentDocType,
    RxDocument<DocumentDocType, DocumentDocMethods>[]
  >
  findOneNotRemoved: () => RxQuery<
    DocumentDocType,
    RxDocument<DocumentDocType, DocumentDocMethods>
  >
}

export type DocumentCollection = RxCollection<
  DocumentDocType,
  DocumentDocMethods,
  DocumentCollectionMethods
>

//#endregion

//#region Userdata

/**
 * Contains only the actual user preferences/settings, for use elsewhere
 */
export type UserSettings = {
  isSpellCheckEnabled: boolean
}

/**
 * Contains mutable, user-editable data about the user like:
 *
 * - preferences/settings
 * - onboarding status (which features has the user interacted with already)
 *
 * Sensitive data, like subscription status etc. shouldn't be stored here,
 * but in a separate, cloud only database that can only be interacted with
 * through a secure API.
 *
 * @todo consider moving all preferences to a separate object
 */
export type UserdataDocType = UserSettings & {
  /**
   * UID of the user this settings object belongs to
   */
  userId: string
}

export type UserdataDocMethods = {}

export type UserdataDoc = RxDocument<UserdataDocType, UserdataDocMethods>

export type UserdataCollectionMethods = {}

export type UserdataCollection = RxCollection<
  UserdataDocType,
  UserdataDocMethods,
  UserdataCollectionMethods
>

//#endregion

//#region Group

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
   * Ordered array of child group IDs
   */
  childGroups: string[]
  // childDocuments: string[]
}

export type GroupDocMethods = {}

export type GroupDoc = RxDocument<GroupDocType, GroupDocMethods>

export type GroupCollectionMethods = {}

export type GroupCollection = RxCollection<
  GroupDocType,
  GroupDocMethods,
  GroupCollectionMethods
>

//#endregion

//#region Database

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
  userdata: UserdataCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>

//#endregion
