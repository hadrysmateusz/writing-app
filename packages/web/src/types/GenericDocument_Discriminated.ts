export type GenericDocument_Discriminated_Base = {
  /**
   * Unique ID corresponding to either a cloud document's id field or a local document's path
   */
  identifier: string

  /**
   * User-facing name of the document
   * (either a cloud document's title field, or a local document's file name)
   * @todo probably rename cloud documents' title field to name for parity with all other resources
   */
  name: string

  /**
   * UNIX timestamp of the document's or file's creation time
   */
  createdAt: number

  /**
   * UNIX timestamp of the document's or file's last modification time
   */
  modifiedAt: number
}

export type GenericDocument_Discriminated_CloudSpecific = {
  /**
   * Type of underlying document
   * (either cloud or local)
   */
  documentType: "cloud"

  /**
   * Identifier of a parent grouping entity, the id of the corresponding RxDB document
   *
   * The null option is for marking root level elements which correspond to cloud documents in the inbox (without a parent group). I could also use the null value for directly opened local docs (if I allow that at some point)
   */
  parentIdentifier: string | null

  /**
   * Whether the document should appear in the favorites view (whatever it ends up being called)
   */
  // isFavorite: boolean // TODO: this probably doesn't belong here, make sure and delete it if certain

  /**
   * Whether the document was deleted and should only appear in trash
   */
  // isDeleted: boolean // TODO: this probably doesn't belong here, make sure and delete it if certain

  /**
   * Array of tagIds
   */
  tags: string[]

  /**
   * Serialized document content (slate object format, JSON.stringified)
   */
  content: string
}

export type GenericDocument_Discriminated_LocalSpecific = {
  /**
   * Type of underlying document
   * (either cloud or local)
   */
  documentType: "local"

  /**
   * Identifier of a parent grouping entity, a directory path
   */
  parentIdentifier: string

  /**
   * File's contents, UTF-8 encoded.
   *
   * TODO: make sure this is in the same format as CloudVariant i.e. slate object format, JSON.stringified or even replace both with already deserialized Descendant[]
   */
  content: string

  /**
   * Document's tags, undefined in local version, skip this
   *
   * This field exists for interoperability with the CloudVariant
   */
  tags?: undefined
}

export type GenericDocument_CloudVariant = GenericDocument_Discriminated_Base &
  GenericDocument_Discriminated_CloudSpecific
export type GenericDocument_LocalVariant = GenericDocument_Discriminated_Base &
  GenericDocument_Discriminated_LocalSpecific

export type GenericDocument_Discriminated =
  | GenericDocument_CloudVariant
  | GenericDocument_LocalVariant
