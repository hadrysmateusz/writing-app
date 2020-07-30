import {
  DocumentDoc,
  DocumentDocType,
  DocumentDocMethods,
  GroupDoc,
} from "../Database"
import { RxDocument, RxQuery } from "rxdb"

// Documents

export type DocumentsAPI = {
  updateDocument: UpdateDocumentFn
  findDocuments: FindDocumentsFn
  findDocumentById: FindDocumentByIdFn
  toggleDocumentFavorite: ToggleDocumentFavoriteFn
  renameDocument: RenameDocumentFn
  moveDocumentToGroup: MoveDocumentToGroupFn
  removeDocument: RemoveDocumentFn
  permanentlyRemoveDocument: PermanentlyRemoveDocumentFn
  restoreDocument: RestoreDocumentFn
  createDocument: CreateDocumentFn
}

export type FindDocumentByIdFn = (
  id: string,
  includeRemoved?: boolean
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods> | null>

export type FindDocumentsFn = (
  includeRemoved?: boolean
) => RxQuery<DocumentDocType, RxDocument<DocumentDocType, DocumentDocMethods>[]>

export type UpdateDocumentFn = (
  id: string,
  updater: DocumentUpdater,
  includeRemoved?: boolean
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods>>

export type CreateDocumentFn = (
  parentGroup: string | null
) => Promise<DocumentDoc>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type RemoveDocumentFn = (documentId: string) => Promise<boolean>

export type PermanentlyRemoveDocumentFn = (
  documentId: string
) => Promise<boolean>

export type RestoreDocumentFn = (documentId: string) => Promise<DocumentDoc>

export type MoveDocumentToGroupFn = (
  documentId: string,
  groupId: string | null
) => Promise<DocumentDoc>

export type ToggleDocumentFavoriteFn = (
  documentId: string
) => Promise<DocumentDoc>

export type UpdateDocumentQueryConstructor = (
  original: RxDocument<DocumentDocType, DocumentDocMethods>
) => any

/**
 * Can be either:
 * - A set of values to be changed
 * - A function that takes the original document as a parameter and returnes an object with new values
 */
export type DocumentUpdater =
  | UpdateDocumentQueryConstructor
  | Partial<DocumentDocType>

// Groups

export type GroupsAPI = {
  createGroup: CreateGroupFn
  renameGroup: RenameGroupFn
  removeGroup: RemoveGroupFn
}

export type CreateGroupFn = (
  parentGroup: string | null,
  values?: Partial<GroupDoc>,
  options?: {
    switchTo?: boolean
  }
) => Promise<GroupDoc>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>
