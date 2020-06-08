import { RxDatabase, RxDocument, RxCollection } from "rxdb"

// ------ Document ------

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
}

export type DocumentDocMethods = {}

export type DocumentDoc = RxDocument<DocumentDocType, DocumentDocMethods>

export type DocumentCollectionMethods = {}

export type DocumentCollection = RxCollection<
  DocumentDocType,
  DocumentDocMethods,
  DocumentCollectionMethods
>

// ------ Group ------

export type GroupDocType = {
  id: string
  name: string
  /**
   * Id of the group this group belongs to
   *
   * Used for nesting groups
   *
   * @todo handle top-level groups that aren't a part of any group
   *
   */
  parentGroup: string | null
}

export type GroupDocMethods = {}

export type GroupDoc = RxDocument<GroupDocType, GroupDocMethods>

export type GroupCollectionMethods = {}

export type GroupCollection = RxCollection<
  GroupDocType,
  GroupDocMethods,
  GroupCollectionMethods
>

// ------ Database -------

export type MyDatabaseCollections = {
  documents: DocumentCollection
  groups: GroupCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>
