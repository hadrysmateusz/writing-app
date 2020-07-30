import {
  DocumentDoc,
  DocumentDocType,
  GroupDoc,
  DocumentDocMethods,
} from "../Database"
import { RxDocument } from "rxdb"
import { DocumentUpdater } from "../APIProvider/types"

export type MainState = {
  isLoading: boolean
  groups: GroupDoc[]
  documents: DocumentDoc[]
  favorites: DocumentDoc[]
  currentDocument: DocumentDoc | null
  saveDocument: SaveDocumentFn
  switchDocument: SwitchDocumentFn
  updateCurrentDocument: UpdateCurrentDocumentFn
}

export type UpdateCurrentDocumentFn = (
  updater: DocumentUpdater
) => Promise<RxDocument<DocumentDocType, DocumentDocMethods>>

export type SaveDocumentFn = () => Promise<DocumentDocType | null>

export type SwitchDocumentFn = (documentId: string | null) => void
