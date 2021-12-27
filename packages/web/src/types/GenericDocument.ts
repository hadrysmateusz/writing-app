export type DocumentTypes = "cloud" | "local"

export type GenericDocument = {
  /**
   * Unique ID corresponding to either a cloud document's id field or a local document's path
   */
  identifier: string
  /**
   * Type of underlying document
   * (either cloud or local)
   */
  documentType: DocumentTypes
  /**
   * User-facing name of the document
   * (either a cloud document's title field, or a local document's file name)
   * @todo probably rename cloud documents' title field to name for parity with all other resources
   */
  name: string
  /**
   * Identifier of a parent grouping entity
   * (either a parent group's id for cloud documents, or a parent directory's path for local docs)
   *
   * The null option is for marking root level elements which correspond to cloud documents in the inbox (without a parent group). I could also use the null value for directly opened local docs (if I allow that at some point)
   */
  parentIdentifier: string | null
  /**
   * UNIX timestamp of the document's or file's creation time
   */
  createdAt: number
  /**
   * UNIX timestamp of the document's or file's last modification time
   */
  modifiedAt: number
  /**
   * Document's content in slate format
   *
   * Currently optional (TODO: either also add it to generic docs created from local docs or remove from here and handle differently)
   */
  content?: string
}

/**
 * Consideration list:
 *
 * - titleSlug - from cloud documents
 * - content - from cloud documents (maybe it should be moved to separate couchdb collection and only fetched when needed (like local docs), so it's not passed around unnecessarily which might cause unnecessary re-renders when editing a doc etc.)
 * - tags - from cloud documents
 * - isFavorite - from cloud documents
 * - isDeleted - from cloud documents
 */
