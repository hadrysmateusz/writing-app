import React, { useState, useCallback, useEffect, useMemo } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { DataStore, Predicates } from "aws-amplify"
import { Slate, ReactEditor } from "slate-react"

import { useCreateEditor } from "@slate-plugin-system/core"

import { deserialize, serialize } from "../Editor/serialization"
import { Sidebar } from "../Sidebar"
import { EditorComponent } from "../Editor"
import { useLogEditor, useLogValue } from "../devToolsUtils"
import { plugins } from "../../pluginsList"
import { useAsyncEffect } from "../../hooks"
import { Document } from "../../models"

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100vw;
  height: 100vh; /* TODO: this needs to be improved */
  background-color: #24292e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";
`

export type CreateDocumentType = {
  title: string
  content: string
}

/**
 * Create document in datastore
 */
const createDocument = async ({ title, content }: CreateDocumentType) => {
  const newDocument = await DataStore.save(
    new Document({
      title,
      content,
    })
  )
  return newDocument
}

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

const Main = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  // currently selected editor - represented by the document id
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  // content of the currently selected editor
  const [content, setContent] = useState<Node[]>(defaultState)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const currentDocument = useMemo(
    () => documents.find((doc) => doc.id === currentEditor),
    [documents, currentEditor]
  )

  /**
   * Load documents from db
   */
  const loadDocuments = async () => {
    try {
      // TODO: This could be optimized by manually modifying state based on the subscription message type and content
      const documents = await DataStore.query(Document, Predicates.ALL)
      // if there are no current documents deselect current editor
      if (documents.length === 0) {
        setCurrentEditor(null)
      }
      setDocuments(documents)
      return documents
    } catch (error) {
      setError(error.message)
      return []
    }
  }

  /**
   * Initialization effect
   *
   * - Fetches all of the user's documents
   * - Sets up a documents subscription
   */
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)
      const documents = await loadDocuments()
      if (!documents[0]) {
        // TODO: create new document
        switchEditor(null)
      } else {
        switchEditor(documents[0].id)
      }
      setIsLoading(false)

      DataStore.observe(Document).subscribe(loadDocuments)
    }

    initialize()
  }, [])

  /**
   * Switch the current editor based on the id of the document in it
   * @param documentId id of the document open in the editor you want to switch to
   */
  const switchEditor = useCallback((documentId: string | null) => {
    // TODO: maybe save the state of the editor (children, history, selection)
    setCurrentEditor(documentId)
  }, [])

  /**
   * Update document
   */
  const updateDocument = async (
    updaterFn: (original: Document) => Promise<Document>
  ) => {
    try {
      if (currentEditor === null) {
        throw new Error("no editor is currently selected")
      }

      const original = documents.find((doc) => doc.id === currentEditor)

      if (original === undefined) {
        throw new Error("no document found matching current editor id")
      }

      const updatedDocument = await updaterFn(original)

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
    return updateDocument((original) => {
      const serializedContent = serialize(content)

      return DataStore.save(
        Document.copyOf(original, (updated) => {
          updated.content = serializedContent
        })
      )
    })
  }

  /**
   * Rename document
   */
  const renameDocument = async (title: string) => {
    return updateDocument((original) =>
      DataStore.save(
        Document.copyOf(original, (updated) => {
          updated.title = title
        })
      )
    )
  }

  /**
   * Handles creating a new document by asking for a name, creating a document
   * in DataStore and switching the editor to the new document
   */
  const newDocument = async (shouldSwitch: boolean = true) => {
    let title: string | null = "New " + Date.now().toString().slice(9, 13) // TODO: this should be null (it is temporarily changed because prompt() is not supported in electron)
    const content = JSON.stringify(defaultState)
    let isFirstPrompt = true

    while (title === null) {
      const t = prompt(isFirstPrompt ? "Title" : "Title (Can't be empty)")

      // return null if the user cancels the prompt
      if (t === null) return null

      // if the title is empty set it to null to repeat the loop
      title = t === "" ? null : t

      // set the isFirstPrompt flag to false to modify the prompt message
      isFirstPrompt = false
    }

    const newDocument = await createDocument({ title, content })

    if (shouldSwitch) {
      switchEditor(newDocument.id)
    }

    // TODO: focus the editable area

    return newDocument
  }

  /**
   * onChange event handler for the Slate component
   */
  const onChange = useCallback((value: Node[]) => {
    setContent(value)
  }, [])

  // Handle changing all of the state and side-effects of switching editors
  useAsyncEffect(async () => {
    console.log("switched editor", currentEditor)
    if (currentEditor === null) {
      setContent(defaultState)
      return
    }

    try {
      // only get the first document (it should be the only one)
      const [document] = await DataStore.query(Document, (c) =>
        c.id("eq", currentEditor)
      )
      const content = document.content
        ? deserialize(document.content)
        : defaultState
      setContent(content)
      // TODO: save history to be restored later
      // reset history
      editor.history = { undos: [], redos: [] }
    } catch (error) {
      // TODO: better handle error (show error state)
      setContent(defaultState)
      throw error
    }
  }, [currentEditor])

  // Create the editor object
  const editor = useCreateEditor(plugins) as ReactEditor

  // DevTools utils
  useLogEditor(editor)
  useLogValue(content)

  return (
    <Slate editor={editor} value={content} onChange={onChange}>
      <InnerContainer>
        {isLoading
          ? "Loading..."
          : error ?? (
              <>
                <Sidebar
                  switchEditor={switchEditor}
                  documents={documents}
                  newDocument={newDocument}
                  saveDocument={saveDocument}
                />
                {currentDocument && (
                  <EditorComponent
                    saveDocument={saveDocument}
                    renameDocument={renameDocument}
                    currentDocument={currentDocument}
                  />
                )}
              </>
            )}
      </InnerContainer>
    </Slate>
  )
}

export default Main
