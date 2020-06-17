import {
  DocumentDoc,
  DocumentDocType,
  GroupDoc,
  DocumentDocMethods,
} from "./Database"
import { RxDocument, RxQuery } from "rxdb"

// Documents

export type FindDocumentByIdFn = (
  id: string,
  includeRemoved?: boolean
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods> | null>

export type FindDocumentsFn = (
  includeRemoved?: boolean
) => Promise<
  RxQuery<DocumentDocType, RxDocument<DocumentDocType, DocumentDocMethods>[]>
>

export type UpdateDocumentFn = (
  id: string,
  updater: DocumentUpdater,
  includeRemoved?: boolean
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods>>

export type NewDocumentFn = (
  shouldSwitch: boolean,
  parentGroup: string | null
) => Promise<DocumentDoc>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type RemoveDocumentFn = (documentId: string) => Promise<void>

export type RestoreDocumentFn = (documentId: string) => Promise<DocumentDoc>

export type MoveDocumentToGroupFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type ToggleDocumentFavoriteFn = (
  documentId: string
) => Promise<DocumentDoc>

export type UpdateCurrentDocumentFn = (
  updater: DocumentUpdater
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods>>

export type SaveDocumentFn = () => Promise<DocumentDocType | null>

export type SwitchDocumentFn = (documentId: string | null) => void

// Groups

export type NewGroupFn = (parentGroup: string | null) => Promise<GroupDoc>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>

// Misc

export type UpdateDocumentQueryConstructor = (
  original: RxDocument<DocumentDocType, DocumentDocMethods>
) => any

/**
 * Can be either:
 *
 * - A set of values to be changed or...
 * - A function that should return an updateQuery using this syntax: https://docs.mongodb.com/manual/reference/operator/update-field/
 */
export type DocumentUpdater =
  | UpdateDocumentQueryConstructor
  | Partial<DocumentDocType>
