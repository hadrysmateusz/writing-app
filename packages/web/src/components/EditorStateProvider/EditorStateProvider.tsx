import React, { useCallback, useState, useMemo } from "react"
import { isEqual } from "lodash"
import { Descendant } from "slate"
import {
  usePlateEventId,
  usePlateEditorState,
  usePlateValue,
} from "@udecode/plate-core"

import { SaveDocumentFn, useMainState } from "../MainProvider"
import { serialize } from "../Editor"

import { createContext } from "../../utils"

export const [EditorStateContext, useEditorState] = createContext<any>() // TODO: fix the typings when I stabilize the api

/**
 * State provider for editor and secondary sidebar
 */
export const EditorStateProvider: React.FC = ({ children }) => {
  const { currentDocument } = useMainState()
  const editor = usePlateEditorState(usePlateEventId("focus"))
  const editorValue = usePlateValue(usePlateEventId("focus"))

  const [isModified, setIsModified] = useState(false)

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback(
    async (value: Descendant[]) => {
      // TODO: I could debounced-save in here (or maybe using a setInterval)

      // if the content has changed, set the modified flag (skip the expensive check if it's already true)
      if (!isModified) {
        const hasChanged = !isEqual(editorValue, value)
        if (hasChanged) {
          setIsModified(true)
        }
      }
    },
    [editorValue, isModified]
  )

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument: SaveDocumentFn = useCallback(async () => {
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return null
    }

    const nodes = editor.children as Descendant[]

    if (isModified) {
      const updatedDocument =
        (await currentDocument?.atomicUpdate((doc) => {
          doc.content = serialize(nodes)
          return doc
        })) || null

      setIsModified(false)
      return updatedDocument
    }
    return null
  }, [currentDocument, editor, isModified])

  const editorState = useMemo(
    () => ({
      isModified,
      saveDocument,
      onChange,
    }),
    [isModified, onChange, saveDocument]
  )

  return (
    <EditorStateContext.Provider value={editorState}>
      {children}
    </EditorStateContext.Provider>
  )
}
