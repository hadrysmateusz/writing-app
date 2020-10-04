import { GroupDoc, DocumentDoc, DocumentDocType } from "../../Database"

import { Sorting, SortingIndex, Direction, Updater } from "./Misc"

export type MainState = {
  isLoading: boolean
  groups: GroupDoc[]
  documents: DocumentDoc[]
  favorites: DocumentDoc[]
  currentDocument: DocumentDoc | null
  currentEditor: string | null
  sorting: Sorting
  changeSorting: ChangeSortingFn
  saveDocument: SaveDocumentFn
  switchDocument: SwitchDocumentFn
  updateCurrentDocument: UpdateCurrentDocumentFn
}

export type ChangeSortingFn = (
  index: SortingIndex,
  direction: Direction
) => void

export type SaveDocumentFn = () => Promise<DocumentDocType | null>

export type SwitchDocumentFn = (documentId: string | null) => void

export type UpdateCurrentDocumentFn = (
  updater: Updater<DocumentDoc, DocumentDocType>
) => Promise<DocumentDoc>
