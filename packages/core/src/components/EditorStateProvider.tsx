import React, { createContext, useState } from "react"
import { useRequiredContext } from "../hooks/useRequiredContext"
import { useCreateEditor } from "@slate-plugin-system/core"
import { ReactEditor, Slate } from "slate-react"
import { plugins } from "../pluginsList"
import { isEqual } from "lodash"
import { Node } from "slate"

export type EditorState = {
  editorValue: Node[]
  isModified: boolean
  setEditorValue: React.Dispatch<React.SetStateAction<Node[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
}

const EditorStateContext = createContext<EditorState | null>(null)

export const useEditorState = () => {
  return useRequiredContext<EditorState>(
    EditorStateContext,
    "EditorState context is null"
  )
}

export const defaultEditorValue = [
  { type: "paragraph", children: [{ text: "" }] },
]

export const EditorStateProvider: React.FC<{}> = ({ children }) => {
  // content of the currently selected editor
  const [content, setContent] = useState<Node[]>(defaultEditorValue)
  // This might only be necessary for local documents (although it might be useful see if the document needs saving when the window closes or reloads etc.)
  const [isModified, setIsModified] = useState(false)

  // Create the editor object
  const editor = useCreateEditor(plugins) as ReactEditor

  /**
   * onChange event handler for the Slate component
   */
  const onChange = (value: Node[]) => {
    // TODO: I could debounced-save in here
    setContent(value)

    // if the content has changed then set the modified flag (skip the expensive check if it's already true)
    if (!isModified) {
      setIsModified(!isEqual(content, value))
    }

    // This might need to change if I implement persistent history
    /* TODO: this breaks after manual saves because history doesn't get removed when saving (no undos doesn't mean no changes when the user saved after some changes)
       When saving the history length should be saved as well and the comparison should be against that, this should solve both the problem of manual saves and persistent history at once
    */
    // if (editor.history.undos.length === 0) {
    //   setIsModified(false)
    // }
  }

  return (
    <Slate editor={editor} value={content} onChange={onChange}>
      <EditorStateContext.Provider
        value={{
          isModified,
          editorValue: content,
          setIsModified,
          setEditorValue: setContent,
        }}
      >
        {children}
      </EditorStateContext.Provider>
    </Slate>
  )
}
