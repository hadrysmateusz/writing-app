import { RxQuery } from "rxdb"
import { Node } from "slate"

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
  parentGroup: string | null,
  values?: {
    title?: string
    content?: Node[]
  },
  options?: CreateDocumentOptions
) => Promise<DocumentDoc>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type RemoveDocumentFn = (documentId: string) => Promise<boolean>

export type PermanentlyRemoveDocumentFn = (documentId: string) => void

export type RestoreDocumentFn = (documentId: string) => Promise<DocumentDoc>

export type MoveDocumentToGroupFn = (
  documentId: string,
  groupId: string | null
) => Promise<DocumentDoc>

export type ToggleDocumentFavoriteFn = (
  documentId: string
) => Promise<DocumentDoc>
