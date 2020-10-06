export type EditorState = {
  editorValue: Node[]
  isModified: boolean
  resetEditor: () => void
  setEditorValue: React.Dispatch<React.SetStateAction<Node[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
}
