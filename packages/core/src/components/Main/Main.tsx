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
import {
  useDatabase,
  DocumentDoc,
  DocumentDocType,
  GroupDoc,
} from "../Database"
import { Subscription } from "rxjs"
import createGroupTree, { GroupTree } from "../../helpers/createGroupTree"
import { NewDocumentFn, RenameDocumentFn, SwitchEditorFn } from "./types"

// TODO: consider creating an ErrorBoundary that will select the start of the document if slate throws an error regarding the selection

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

const Main = () => {
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [groups, setGroups] = useState<GroupTree>([])
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
   * - Fetches all of the user's documents & groups
   * - Sets up subscriptions
   */
  useEffect(() => {
    let documentsSub: Subscription | undefined
    let groupsSub: Subscription | undefined

    const setup = async () => {
      const updateDocumentsList = (documents: DocumentDoc[]) => {
        try {
          if (!documents) {
            throw new Error("Couldn't fetch documents")
          }
          // If there are no documents, throw an error - it will be caught and the currentEditor will be set to null
          if (documents.length === 0) {
            throw new Error("Empty")
          }
          setDocuments(documents)
          setCurrentEditor(documents[0].id)
        } catch (error) {
          console.error(error)
          /* TODO: This is to handle any errors gracefully in production, but a
          better system should be in place to handle any unexpected errors */
          setCurrentEditor(null)
        }
      }

      const updateGroupsList = (groups: GroupDoc[]) => {
        const groupTree = createGroupTree(groups)
        setGroups(groupTree)
      }

      const documentsQuery = db.documents.find()
      const groupsQuery = db.groups.find()

      // perform first-time setup

      if (isInitialLoad) {
        const documentsPromise = documentsQuery.exec()
        const groupsPromise = groupsQuery.exec()

        const [newGroups, newDocuments] = await Promise.all([
          groupsPromise,
          documentsPromise,
        ])

        setIsInitialLoad(false)
        updateGroupsList(newGroups)
        updateDocumentsList(newDocuments)
        setIsLoading(false)
      }

      // set up subscriptions

      documentsSub = documentsQuery.$.subscribe((newDocuments) => {
        updateDocumentsList(newDocuments)
      })

      groupsSub = groupsQuery.$.subscribe((newGroups) => {
        updateGroupsList(newGroups)
      })
    }

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
      if (groupsSub) {
        groupsSub.unsubscribe()
      }
    }
  }, [db.documents, db.groups, isInitialLoad])

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

  const switchEditor = (id: string) => {
    setCurrentEditor(id)
  }

  /**
   * Update document
   *
   * TODO: use a more generic update document function inside that will query a document based on id
   */
  const updateCurrentDocument = async (newValues: Partial<DocumentDocType>) => {
    try {
      if (currentEditor === null) {
        throw new Error("no editor is currently selected")
      }

      // TODO: replace with a db query (to avoid some potential issues and edge-cases)
      const original = documents.find((doc) => doc.id === currentEditor)

      if (original === undefined) {
        throw new Error("no document found matching current editor id")
      }

      // TODO: if I move to redux I'll have to query the original based on id first
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
   *
   * Works on the current document
   */
  const saveDocument = async () => {
    if (isModified) {
      const serializedContent = serialize(content)
      const updatedDocument = await updateCurrentDocument({
        content: serializedContent,
      })
      setIsModified(false)
      return updatedDocument
    }
    return null
  }

  /**
   * Rename document by id
   */
  const renameDocument: RenameDocumentFn = async (
    documentId: string,
    title: string
  ) => {
    // TODO: replace with a db query (to avoid some potential issues and edge-cases)
    const original = documents.find((doc) => doc.id === documentId)

    if (original === undefined) {
      throw new Error(`no document found matching this id (${documentId})`)
    }

    const newTitle = title.trim()

    const updatedDocument = await original.update({
      $set: {
        title: newTitle,
      },
    })

    // TODO: error handling

    return updatedDocument
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
  const newDocument: NewDocumentFn = useCallback(
    async (shouldSwitch: boolean, parentGroup: string | null) => {
      // TODO: support null value for content for empty documents

      const newDocument = await db.documents.insert({
        id: uuidv4(),
        title: "",
        content: JSON.stringify(defaultState),
        parentGroup: parentGroup,
      })

      if (shouldSwitch) {
        console.log("switching to " + newDocument.id)
        setCurrentEditor(newDocument.id)
      }

      return newDocument
    },
    [db.documents]
  )

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
        // TODO: maybe infer the collection somehow from the current document or something else
        newDocument(true, null)
      }),
    [newDocument]
  )

  const currentDocument =
    documents.find((doc) => doc.id === currentEditor) || null

  console.log("groups", groups)

  return (
    <Slate editor={editor} value={content} onChange={onChange}>
      <InnerContainer>
        {isLoading
          ? "Loading..."
          : error ?? (
              <>
                <Sidebar
                  switchEditor={setCurrentEditor}
                  renameDocument={renameDocument}
                  newDocument={newDocument}
                  documents={documents}
                  groups={groups}
                  editorContent={content}
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
  background-color: #1e1e1e;
  color: white;
  font-family: "Segoe UI", "Open sans", "sans-serif";
`

export default Main
