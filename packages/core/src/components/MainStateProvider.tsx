import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  createContext,
} from "react"
import { useEditor } from "slate-react"
import { Subscription } from "rxjs"
import { v4 as uuidv4 } from "uuid"

import { deserialize, serialize } from "./Editor/serialization"
import { useDatabase, DocumentDoc, DocumentDocType, GroupDoc } from "./Database"
import { useEditorState, defaultEditorValue } from "./EditorStateProvider"

import { listenForIpcEvent } from "../utils"
import { useRequiredContext } from "../hooks/useRequiredContext"

import {
  NewDocumentFn,
  RenameDocumentFn,
  SaveDocumentFn,
  UpdateCurrentDocumentFn,
  SwitchDocumentFn,
  NewGroupFn,
  RenameGroupFn,
  MoveDocumentToGroupFn,
} from "./types"

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export type MainState = {
  documents: DocumentDoc[]
  groups: GroupDoc[]
  currentDocument: DocumentDoc | null
  isLoading: boolean
  saveDocument: SaveDocumentFn
  renameDocument: RenameDocumentFn
  moveDocumentToGroup: MoveDocumentToGroupFn
  switchDocument: SwitchDocumentFn
  newDocument: NewDocumentFn
  newGroup: NewGroupFn
  renameGroup: RenameGroupFn
}

const MainStateContext = createContext<MainState | null>(null)

export const useMainState = () => {
  return useRequiredContext<MainState>(
    MainStateContext,
    "MainState context is null"
  )
}

export const MainStateProvider: React.FC<{}> = ({ children }) => {
  const db = useDatabase()
  const editor = useEditor()
  const {
    editorValue,
    isModified,
    setEditorValue,
    setIsModified,
  } = useEditorState()

  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  // TODO: rename to groupTree to avoid confusion (And also probably move it elsewhere)
  const [groups, setGroups] = useState<GroupDoc[]>([])
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Flag to manage whether this is the first time documents are loaded
  // const [error, setError] = useState<string | null>(null)

  /**
   * Update current document
   *
   * TODO: use a more generic update document function inside that will query a document based on id
   */
  const updateCurrentDocument: UpdateCurrentDocumentFn = async (
    newValues: Partial<DocumentDocType>
  ) => {
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
      const updatedDocument: DocumentDocType = await original.update({
        $set: newValues,
      })

      return updatedDocument
    } catch (error) {
      // TODO: better error handling
      throw error
      // const msgBase = "Can't update the current document"
      // console.error(`${msgBase}: ${error.message}`)
      // setError(msgBase)
      // return null
    }
  }

  /**
   * Save document
   *
   * Works on the current document
   */
  const saveDocument: SaveDocumentFn = async () => {
    if (isModified) {
      const serializedContent = serialize(editorValue)
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

    const updated = await original.update({
      $set: {
        title: title.trim(),
      },
    })

    // TODO: error handling

    return updated as DocumentDoc
  }

  /**
   * Rename document by id
   */
  const moveDocumentToGroup: MoveDocumentToGroupFn = async (
    documentId: string,
    groupId: string
  ) => {
    // TODO: replace with a db query (to avoid some potential issues and edge-cases)
    const original = documents.find((doc) => doc.id === documentId)

    if (original === undefined) {
      throw new Error(`no document found matching this id (${documentId})`)
    }

    const updated = await original.update({
      $set: {
        parentGroup: groupId,
      },
    })

    // TODO: error handling

    return updated as DocumentDoc
  }

  /**
   * Handles creating a new document
   */
  const newDocument: NewDocumentFn = useCallback(
    async (shouldSwitch: boolean, parentGroup: string | null) => {
      // TODO: support null value for content for empty documents

      const timestamp = Date.now()

      const newDocument = await db.documents.insert({
        id: uuidv4(),
        title: "",
        content: JSON.stringify(defaultEditorValue),
        parentGroup: parentGroup,
        createdAt: timestamp,
        modifiedAt: timestamp,
      })

      if (shouldSwitch) {
        console.log("switching to " + newDocument.id)
        setCurrentEditor(newDocument.id)
      }

      return newDocument
    },
    [db.documents]
  )

  /**
   * Handles creating a new document by asking for a name, creating a document
   * in DataStore and switching the editor to the new document
   */
  const newGroup: NewGroupFn = useCallback(
    async (parentGroup: string | null) => {
      const newGroup = await db.groups.insert({
        id: uuidv4(),
        name: "",
        parentGroup: parentGroup,
      })

      return newGroup
    },
    [db.groups]
  )

  /**
   * Rename group by id
   */
  const renameGroup = async (groupId: string, name: string) => {
    const original = await db.groups.findOne().where("id").eq(groupId).exec()

    if (original === null) {
      throw new Error(`no group found matching this id (${groupId})`)
    }

    const updated = await original.update({
      $set: {
        name: name.trim(),
      },
    })

    // TODO: error handling

    return updated as GroupDoc
  }

  /**
   * Handles deleting groups and its children
   * TODO: add a function type
   */
  const deleteGroup = useCallback(async () => {
    // TODO: add the logic for deleting a group and its subgroups and the child documents
  }, [])

  const switchDocument = (id: string | null) => {
    setCurrentEditor(id)
  }

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
        setGroups(newGroups)
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

  /**
   * Handles changing all of the state and side-effects of switching editors
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
      if (currentEditor === null) {
        setEditorValue(defaultEditorValue)
        return
      }

      // TODO: if I move to redux I will have to query the document first by id
      const document = documents.find((doc) => doc.id === currentEditor)

      if (!document) {
        setEditorValue(defaultEditorValue)
        return
      }

      const content = document.content
        ? deserialize(document.content)
        : defaultEditorValue

      setEditorValue(content)
    }

    ;(async () => {
      resetEditor()
      await setEditorContent()
    })()

    // eslint-disable-next-line
  }, [currentEditor])

  // Handle "new-document" messages from the main process
  useEffect(
    () =>
      // TODO: check if this needs cleanup
      listenForIpcEvent("new-document", () => {
        // Remove domSelection to prevent errors
        window.getSelection()?.removeAllRanges()
        // Create the new document
        // TODO: maybe infer the collection somehow from the current document or something else
        newDocument(true, null)
      }),
    [newDocument]
  )

  const currentDocument = useMemo(() => {
    return documents.find((doc) => doc.id === currentEditor) || null
  }, [currentEditor, documents])

  return (
    <MainStateContext.Provider
      value={{
        currentDocument,
        groups,
        documents,
        isLoading,
        switchDocument,
        newDocument,
        saveDocument,
        renameDocument,
        newGroup,
        renameGroup,
        moveDocumentToGroup,
      }}
    >
      {children}
    </MainStateContext.Provider>
  )
}
