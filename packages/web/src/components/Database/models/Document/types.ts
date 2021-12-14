import { RxDocument, RxCollection, RxQuery } from "rxdb"

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
   * A specially formatted title used for things like sorting
   */
  titleSlug: string
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
   * Array of tagIds
   */
  tags: string[]
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
