import { Descendant } from "slate"
import { SaveDocumentFn } from "../MainProvider"

export type EditorState = {
  editorValue: Descendant[]
  isModified: boolean
  resetEditor: () => void
  setEditorValue: React.Dispatch<React.SetStateAction<Descendant[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
  saveDocument: SaveDocumentFn
}
