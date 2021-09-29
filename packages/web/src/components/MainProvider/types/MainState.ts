import { GroupDoc, DocumentDoc, DocumentDocType } from "../../Database"

import { Sorting, SortingIndex, Direction, Updater } from "./Misc"

export type MainState = {
  isLoading: boolean
  isDocumentLoading: boolean
  groups: GroupDoc[]
  // documents: DocumentDoc[]
  favorites: DocumentDoc[]
  currentDocument: DocumentDoc | null
  currentEditor: string | null
  sorting: Sorting
  unsyncedDocs: string[]
  changeSorting: ChangeSortingFn
  switchDocument: SwitchDocumentFn
  updateCurrentDocument: UpdateCurrentDocumentFn
  openDocument: OpenDocumentFn
}

export type ChangeSortingFn = (
  index: SortingIndex,
  direction: Direction
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
