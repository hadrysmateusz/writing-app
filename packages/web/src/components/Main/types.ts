import { Node } from "slate"
import { SaveDocumentFn } from "../MainProvider"

export type EditorState = {
  editorValue: Node[]
  isModified: boolean
  resetEditor: () => void
  setEditorValue: React.Dispatch<React.SetStateAction<Node[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
  saveDocument: SaveDocumentFn
}
