import { RxQuery } from "rxdb"

import { DocumentDoc, DocumentDocType } from "../../Database"
import { Updater } from "./Misc"

export type DocumentsAPI = {
  updateDocument: UpdateDocumentFn
  findDocuments: FindDocumentsFn
  findDocumentById: FindDocumentByIdFn
  toggleDocumentFavorite: ToggleDocumentFavoriteFn
  renameDocument: RenameDocumentFn
  moveDocumentToGroup: MoveDocumentToGroupFn
  removeDocument: RemoveDocumentFn
  permanentlyRemoveDocument: PermanentlyRemoveDocumentFn
  actuallyPermanentlyRemoveDocument: ActuallyPermanentlyRemoveDocumentFn
  actuallyPermanentlyRemoveAllDocuments: ActuallyPermanentlyRemoveAllDocumentsFn
  permanentlyRemoveAllDocuments: PermanentlyRemoveAllDocumentsFn
  restoreDocument: RestoreDocumentFn
  createDocument: CreateDocumentFn
}

export type CreateDocumentOptions = {
  switchToDocument?: boolean
  switchToGroup?: boolean
}

export type FindDocumentByIdFn = (
  id: string,
  includeRemoved?: boolean
) => Promise<DocumentDoc | null>
export type FindDocumentsFn = (
  includeRemoved?: boolean
) => RxQuery<DocumentDocType, DocumentDoc[]>
export type UpdateDocumentFn = (
  id: string,
  updater: Updater<DocumentDoc, DocumentDocType>,
  includeRemoved?: boolean
) => Promise<DocumentDoc>
export type CreateDocumentFn = (
  /**
   * Initial values for the document
   */
  values: {
    // Required
    parentGroup: DocumentDocType["parentGroup"]
    // Optional
    title?: DocumentDocType["title"]
    content?: DocumentDocType["content"]
    tags?: DocumentDocType["tags"]
  },
  options?: CreateDocumentOptions
) => Promise<DocumentDoc>
export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>
export type RemoveDocumentFn = (documentId: string) => Promise<boolean>
export type PermanentlyRemoveDocumentFn = (documentId: string) => void
export type ActuallyPermanentlyRemoveDocumentFn = (
  documentId: string
) => Promise<void>
export type ActuallyPermanentlyRemoveAllDocumentsFn = () => Promise<void>
export type PermanentlyRemoveAllDocumentsFn = () => void
export type RestoreDocumentFn = (documentId: string) => Promise<DocumentDoc>
export type MoveDocumentToGroupFn = (
  documentId: string,
  groupId: string | null
) => Promise<DocumentDoc>
export type ToggleDocumentFavoriteFn = (
  documentId: string
) => Promise<DocumentDoc>
