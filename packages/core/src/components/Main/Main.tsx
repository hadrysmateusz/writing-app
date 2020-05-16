import React, { useState, useCallback, useEffect } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { Slate, ReactEditor } from "slate-react"
import { v4 as uuidv4 } from "uuid"

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
        if (!documents[0]) {
          console.log("no documents")
          // TODO: create new document
          setCurrentEditor(null)
        }

        console.log("reload documents-list ")
        console.dir(documents)
        setDocuments(documents)
        setIsLoading(false)
      })
    }

    subscribeToDocuments()

    return () => {
      if (!sub) return
      sub.unsubscribe()
    }
  }, [])

  // Handle changing all of the state and side-effects of switching editors
  useEffect(() => {
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

      console.log(document)

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
  const saveDocument = () => {
    const serializedContent = serialize(content)
    return updateDocument({
      content: serializedContent,
    })
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
  const onChange = useCallback((value: Node[]) => {
    setContent(value)
  }, [])

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
