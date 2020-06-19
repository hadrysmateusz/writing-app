import React, { useState, useCallback, useEffect, createContext } from "react"
import { useEditor } from "slate-react"
import { Subscription } from "rxjs"

import { deserialize, serialize } from "../Editor/serialization"
import { useDatabase, DocumentDoc, GroupDoc } from "../Database"
import { useEditorState, defaultEditorValue } from "../EditorStateProvider"
import { DocumentUpdater, useDocumentsAPI } from "../DocumentsAPI"

import { listenForIpcEvent } from "../../utils"
import { useRequiredContext } from "../../hooks/useRequiredContext"

import {
  SaveDocumentFn,
  UpdateCurrentDocumentFn,
  SwitchDocumentFn,
  MainState,
} from "./MainTypes"

export const MainStateContext = createContext<MainState | null>(null)

export const useMainState = () => {
  return useRequiredContext<MainState>(
    MainStateContext,
    "MainState context is null"
  )
}

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export const MainStateProvider: React.FC<{}> = ({ children }) => {
  const db = useDatabase()
  const editor = useEditor()
  const { updateDocument, findDocumentById, createDocument } = useDocumentsAPI()
  const {
    editorValue,
    isModified,
    setEditorValue,
    setIsModified,
  } = useEditorState()

  const [groups, setGroups] = useState<GroupDoc[]>([])
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [favorites, setFavorites] = useState<DocumentDoc[]>([])
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  const [currentDocument, setCurrentDocument] = useState<DocumentDoc | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    return true
  }) // Flag to manage whether this is the first time documents are loaded

  const updateDocumentsList = useCallback((documents: DocumentDoc[]) => {
    try {
      if (!documents) {
        throw new Error("Couldn't fetch documents")
      }
      // If there are no documents, throw an error - it will be caught and the currentEditor will be set to null
      if (documents.length === 0) {
        throw new Error("Empty")
      }
      setDocuments(documents)
    } catch (error) {
      console.error(error)
      /* TODO: This is to handle any errors gracefully in production, but a
      better system should be in place to handle any unexpected errors */
      setCurrentEditor(null)
    }
  }, [])

  /**
   * Switches the currently open document
   */
  const switchDocument: SwitchDocumentFn = useCallback((id: string | null) => {
    setCurrentEditor(id)
  }, [])

  /**
   * Update current document
   */
  const updateCurrentDocument: UpdateCurrentDocumentFn = useCallback(
    async (updater: DocumentUpdater) => {
      try {
        if (currentEditor === null) {
          throw new Error("no document is currently selected")
        }
        const updatedDocument = await updateDocument(
          currentEditor,
          updater,
          true
        )
        return updatedDocument
      } catch (error) {
        // TODO: better error handling
        throw error
        // const msgBase = "Can't update the current document"
        // console.error(`${msgBase}: ${error.message}`)
        // setError(msgBase)
        // return null
      }
    },
    [currentEditor, updateDocument]
  )

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument: SaveDocumentFn = useCallback(async () => {
    if (isModified) {
      const serializedContent = serialize(editorValue)
      const updatedDocument = await updateCurrentDocument({
        content: serializedContent,
      })
      setIsModified(false)
      return updatedDocument
    }
    return null
  }, [editorValue, isModified, setIsModified, updateCurrentDocument])

  // TODO: figure out a replacement for the old newDocument function that also switches to it, or just expose this function
  const createNewDocument = useCallback(async () => {
    const newDocument = await createDocument(null)
    switchDocument(newDocument.id)
  }, [createDocument, switchDocument])
  /**
   * Initialization effect
   *
   * - Fetches all of the user's documents & groups
   * - Sets up subscriptions
   */
  useEffect(() => {
    let documentsSub: Subscription | undefined
    let groupsSub: Subscription | undefined
    let favoritesSub: Subscription | undefined

    const setup = async () => {
      const documentsQuery = db.documents.findNotRemoved()
      const favoritesQuery = db.documents
        .findNotRemoved()
        .where("isFavorite")
        .eq(true)
      const groupsQuery = db.groups.find()

      // perform first-time setup

      if (isInitialLoad) {
        console.log("running initial load stuff")
        const documentsPromise = documentsQuery.exec()
        const groupsPromise = groupsQuery.exec()
        const favoritesPromise = favoritesQuery.exec()

        const [newGroups, newDocuments, newFavorites] = await Promise.all([
          groupsPromise,
          documentsPromise,
          favoritesPromise,
        ])

        if (newDocuments && newDocuments[0]) {
          switchDocument(newDocuments[0].id)
        }

        setIsInitialLoad(false)
        setGroups(newGroups)
        setFavorites(newFavorites)
        updateDocumentsList(newDocuments)
        setIsLoading(false)
      }

      // set up subscriptions

      documentsSub = documentsQuery.$.subscribe((newDocuments) => {
        updateDocumentsList(newDocuments)
      })

      groupsSub = groupsQuery.$.subscribe((newGroups) => {
        setGroups(newGroups)
      })

      favoritesSub = favoritesQuery.$.subscribe((newFavorites) => {
        setFavorites(newFavorites)
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
      if (favoritesSub) {
        favoritesSub.unsubscribe()
      }
    }
  }, [
    db.documents,
    db.groups,
    isInitialLoad,
    switchDocument,
    updateDocumentsList,
  ])

  /**
   * Handles changing all of the state and side-effects of switching editors
   *
   * TODO: this needs a significant rework for readability and reliablility
   */
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
      console.log("current editor is:", currentEditor)
      if (currentEditor === null) {
        setEditorValue(defaultEditorValue)
        return
      }

      // We include removed documents to make it possible to preview documents in trash
      const documentDoc = await findDocumentById(currentEditor, true)

      // TODO: empty states need better handling because this will lead to issues
      if (documentDoc === null) {
        console.warn(
          `Document with id: ${currentEditor} was not found - empty state was used. THIS IS A TEMPORARY SOLUTION - IT NEEDS TO CHANGE.`
        )
        setEditorValue(defaultEditorValue)
        return
      }

      const content = documentDoc.content
        ? deserialize(documentDoc.content)
        : defaultEditorValue
      setEditorValue(content)
    }

    ;(async () => {
      resetEditor()
      await setEditorContent()
    })()

    // OTHER DEPENDENCIES ARE PURPOSEFULLY IGNORED - THIS MIGHT NEED A BETTER SOLUTION
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEditor])

  // TODO: figure a way to reduce duplication of these queries
  useEffect(() => {
    const fn = async () => {
      if (currentEditor === null) {
        setCurrentDocument(null)
        return
      }
      const documentDoc = await findDocumentById(currentEditor, true)
      setCurrentDocument(documentDoc)
    }
    fn()
  }, [currentEditor, findDocumentById])

  // Handle "new-document" messages from the main process
  useEffect(
    () =>
      // TODO: check if this needs cleanup
      listenForIpcEvent("new-document", () => {
        // Remove domSelection to prevent errors
        window.getSelection()?.removeAllRanges()
        // Create the new document
        // TODO: maybe infer the collection somehow from the current document or something else
        createNewDocument()
      }),
    [createNewDocument]
  )

  return (
    <MainStateContext.Provider
      value={{
        currentDocument,
        groups,
        favorites,
        documents,
        isLoading,
        switchDocument,
        saveDocument,
        updateCurrentDocument,
      }}
    >
      {children}
    </MainStateContext.Provider>
  )
}
