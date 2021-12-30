import React, { useCallback, useState, useMemo } from "react"
import isEqual from "lodash/isEqual"
import { Descendant } from "slate"
import { usePlateEventId, usePlateEditorRef } from "@udecode/plate-core"

import { createContext } from "../../utils"

import { serialize } from "../Editor"
import { useTabsState } from "../TabsProvider"

// TODO: this needs a significant rework/rethinking since the migration to plate

export const [EditorStateContext, useEditorState] = createContext<any>() // TODO: fix the typings when I stabilize the api

/**
 * State provider for editor and secondary sidebar
 */
export const EditorStateProvider: React.FC = ({ children }) => {
  const { currentCloudDocument } = useTabsState()
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  const [isModified, setIsModified] = useState(false)

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback(
    async (value: Descendant[]) => {
      // TODO: I could debounced-save in here (or maybe using a setInterval)
      // if the content has changed, set the modified flag (skip the expensive check if it's already true)
      if (!isModified) {
        const hasChanged = !isEqual(editor?.value, value)
        if (hasChanged) {
          setIsModified(true)
        }
      }
    },
    [editor?.value, isModified]
  )

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument = useCallback(() => {
    if (!isModified) {
      console.log("skipping save, document wasn't changed")
      return null
    }
    if (editor === undefined) {
      console.error("Can't save, the editor is undefined")
      return null
    }
    if (currentCloudDocument === null) {
      console.log("Can't save, there is no currentCloudDocument")
      return null
    }

    const nodes = editor.children as Descendant[]

    currentCloudDocument.atomicUpdate((doc) => {
      // console.log("updating with", JSON.stringify(nodes, null, 2))
      doc.content = serialize(nodes)
      return doc
    })

    return null
  }, [currentCloudDocument, editor, isModified])

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
