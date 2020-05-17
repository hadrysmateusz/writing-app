import React, { useState, useCallback, useEffect } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { Slate, ReactEditor } from "slate-react"
import { v4 as uuidv4 } from "uuid"
import { isEqual } from "lodash"

import { useCreateEditor } from "@slate-plugin-system/core"

import { Sidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { plugins } from "../../pluginsList"
import { deserialize, serialize } from "../Editor/serialization"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { listenForIpcEvent } from "../../utils"
import { useDatabase, DocumentDoc, DocumentDocType } from "../Database"
import { Subscription } from "rxjs"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

const Main = () => {
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  // currently selected editor - represented by the document id
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  // content of the currently selected editor
  const [content, setContent] = useState<Node[]>(defaultState)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const db = useDatabase()
  const [isModified, setIsModified] = useState(false) // This might only be necessary for local documents (although it might be useful see if the document needs saving when the window closes or reloads etc.)
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Flag to manage whether this is the first time documents are loaded
  /**
   * Initialization effect
   *
   * - Fetches all of the user's documents
   * - Sets up a documents subscription
   */
  useEffect(() => {
    let sub: Subscription | undefined

    const subscribeToDocuments = async () => {
      // TODO: add sorting (it probably requires creating indexes)
      sub = db.documents.find().$.subscribe((documents) => {
        setIsInitialLoad(() => false)
        console.log("reloading documents list")
        setDocuments(documents)

        // If there are no documents, clear the selected editor to prevent errors and show empty state
        if (!documents[0]) {
          setCurrentEditor(null)
        }

        if (isInitialLoad) setCurrentEditor(documents[0].id)

        setIsLoading(false)
      })
    }

    subscribeToDocuments()

    return () => {
      if (!sub) return
      sub.unsubscribe()
    }
  }, [db.documents, isInitialLoad])

  // Handle changing all of the state and side-effects of switching editors
  useEffect(() => {
    setIsModified(false) // TODO: this will have to change when/if multi-tab is implemented

    // Reset any properties on the editor objects that shouldn't be shared between documents
    // TODO; eventually I should save and restore these per documentID
    const resetEditor = () => {
      editor.history = { undos: [], redos: [] }
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      }
    }

    const setEditorContent = async () => {
      // TODO: better handle empty states
      if (currentEditor === null) {
        setContent(defaultState)
        return
      }

      // TODO: if I move to redux I will have to query the document first by id
      const document = documents.find((doc) => doc.id === currentEditor)

      if (!document) {
        setContent(defaultState)
        return
      }

      const content = document.content
        ? deserialize(document.content)
        : defaultState

      setContent(content)
    }

    ;(async () => {
      resetEditor()
      await setEditorContent()
    })()

    // eslint-disable-next-line
  }, [currentEditor])

  /**
   * Update document
   */
  const updateDocument = async (newValues: Partial<DocumentDocType>) => {
    try {
      if (currentEditor === null) {
        throw new Error("no editor is currently selected")
      }

      const original = documents.find((doc) => doc.id === currentEditor)

      if (original === undefined) {
        throw new Error("no document found matching current editor id")
      }

      // TODO: if I move to redux I'will have to query the original based on id first
      const updatedDocument = await original.update({
        $set: newValues,
      })

      return updatedDocument
    } catch (error) {
      const msgBase = "Can't update the current document"
      console.error(`${msgBase}: ${error.message}`)
      setError(msgBase)
      return null
    }
  }

  /**
   * Save document
   */
  const saveDocument = async () => {
    if (isModified) {
      const serializedContent = serialize(content)
      const updatedDocument = await updateDocument({
        content: serializedContent,
      })
      setIsModified(false)
      return updatedDocument
    }
    return null
  }

  /**
   * Rename document
   */
  const renameDocument = (title: string) => {
    return updateDocument({
      title: title,
    })
  }

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

  // Create the editor object
  const editor = useCreateEditor(plugins) as ReactEditor

  /**
   * Handles creating a new document by asking for a name, creating a document
   * in DataStore and switching the editor to the new document
   */
  const newDocument = useCallback(async (shouldSwitch: boolean = true) => {
    // TODO: support null value for content for empty documents

    const newDocument = await db.documents.insert({
      id: uuidv4(),
      title: "",
      content: JSON.stringify(defaultState),
    })

    if (shouldSwitch) {
      console.log("switching to " + newDocument.id)
      setCurrentEditor(newDocument.id)
    }

    return newDocument
  }, [])

  // DevTools utils
  useLogEditor(editor)
  useLogValue(content)

  // Handle "new-document" messages from the main process
  useEffect(
    () =>
      listenForIpcEvent("new-document", () => {
        // Remove domSelection to prevent errors
        window.getSelection()?.removeAllRanges()
        // Create the new document
        newDocument()
      }),
    [newDocument]
  )

  const currentDocument =
    documents.find((doc) => doc.id === currentEditor) || null

  return (
    <Slate editor={editor} value={content} onChange={onChange}>
      <InnerContainer>
        {isLoading
          ? "Loading..."
          : error ?? (
              <>
                <Sidebar
                  switchEditor={setCurrentEditor}
                  documents={documents}
                  newDocument={newDocument}
                  currentDocument={currentDocument}
                  isCurrentModified={isModified}
                />
                {currentDocument && (
                  <EditorComponent
                    key={currentDocument.id} // Necessary to reload the component on id change
                    currentDocument={currentDocument}
                    saveDocument={saveDocument}
                    renameDocument={renameDocument}
                  />
                )}
              </>
            )}
      </InnerContainer>
    </Slate>
  )
}

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100vw;
  height: 100vh; /* TODO: this needs to be improved */
  background-color: #24292e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";
`

export default Main
