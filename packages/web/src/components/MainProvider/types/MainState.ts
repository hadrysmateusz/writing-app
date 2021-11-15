import { GroupDoc, DocumentDoc, DocumentDocType } from "../../Database"

import { Sorting, SortingIndex, SortingDirection, Updater } from "./Misc"

export type MainState = {
  // isLoading: boolean
  // documents: DocumentDoc[]
  // favorites: DocumentDoc[]
  isDocumentLoading: boolean
  groups: GroupDoc[]
  currentDocument: DocumentDoc | null
  currentDocumentId: string | null
  sorting: Sorting
  // unsyncedDocs: string[]
  changeSorting: ChangeSortingFn
  updateCurrentDocument: UpdateCurrentDocumentFn
  openDocument: OpenDocumentFn
  closeTab: (tabId: string) => void
}

export type ChangeSortingFn = (
  index: SortingIndex,
  direction: SortingDirection
) => void

export type SaveDocumentFn = () => Promise<DocumentDocType | null> // TODO: move

export type OpenDocumentFn = (
  documentId: string | null,
  options?: { inNewTab?: boolean }
) => Promise<DocumentDoc | null>

export type SwitchDocumentFn = OpenDocumentFn

export type UpdateCurrentDocumentFn = (
  updater: Updater<DocumentDoc, DocumentDocType>
) => Promise<DocumentDoc>
