import React, { useCallback, useEffect, useState } from "react"
import { isEqual } from "lodash"
import { createEditor, Node } from "slate"
import { ReactEditor, Slate } from "slate-react"

import { plugins } from "../pluginsList"
import { applyPlugins } from "../slate-plugin-system"
import { createContext } from "../utils"
import { useDevUtils } from "../dev-tools"
import { History } from "slate-history"

export type EditorState = {
  editorValue: Node[]
  isModified: boolean
  resetEditor: () => void
  setEditorValue: React.Dispatch<React.SetStateAction<Node[]>>
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>
}

export const [useEditorState, _, EditorStateContext] = createContext<
  EditorState
>()

export const DEFAULT_EDITOR_VALUE: Node[] = [
  { type: "paragraph", children: [{ text: "" }] },
]

export const DEFAULT_EDITOR_HISTORY: History = { undos: [], redos: [] }

export const EditorStateProvider: React.FC<{}> = ({ children }) => {
  // content of the currently selected editor

  const [editorValue, setEditorValue] = useState<Node[]>(DEFAULT_EDITOR_VALUE)

  const [isModified, setIsModified] = useState(false)
  const [editor, setEditor] = useState<ReactEditor | null>(null)

  const createEditorObject = useCallback(() => {
    console.log("creating new editor")
    let editor = applyPlugins(createEditor(), plugins) as ReactEditor
    console.log("created new editor", editor)

    setEditor(editor)
  }, [])

  /**
   * Creates the editor object
   */
  useEffect(() => {
    createEditorObject()
  }, [createEditorObject])

  /**
   * onChange event handler for the Slate component
   */
  const onChange = (value: Node[]) => {
    console.log("setting editor value to", value)

    // TODO: I could debounced-save in here
    setEditorValue(value)

    // if the content has changed, set the modified flag (skip the expensive check if it's already true)
    if (!isModified) {
      setIsModified(!isEqual(editorValue, value))
    }
  }

  useDevUtils({ value: editorValue, editor })

  return (
    editor && (
      <Slate editor={editor} value={editorValue} onChange={onChange}>
        <EditorStateContext.Provider
          value={{
            isModified,
            editorValue,
            resetEditor: createEditorObject,
            setIsModified,
            setEditorValue,
          }}
        >
          {children}
        </EditorStateContext.Provider>
      </Slate>
    )
  )
}

export {}
