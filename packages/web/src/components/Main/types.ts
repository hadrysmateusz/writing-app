import { SaveDocumentFn } from "../MainProvider"

export type EditorState = {
  isModified: boolean
  resetEditor: () => void
  saveDocument: SaveDocumentFn
}
