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
  ToggleDocumentFavoriteFn,
  RemoveGroupFn,
  RemoveDocumentFn,
  RestoreDocumentFn,
} from "./types"

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export type MainState = {
  isLoading: boolean
  groups: GroupDoc[]
  documents: DocumentDoc[]
  favorites: DocumentDoc[]
  currentDocument: DocumentDoc | null
  // Document Functions
  toggleDocumentFavorite: ToggleDocumentFavoriteFn
  saveDocument: SaveDocumentFn
  renameDocument: RenameDocumentFn
  moveDocumentToGroup: MoveDocumentToGroupFn
  switchDocument: SwitchDocumentFn
  removeDocument: RemoveDocumentFn
  restoreDocument: RestoreDocumentFn
  newDocument: NewDocumentFn
  // Group Functions
  newGroup: NewGroupFn
  renameGroup: RenameGroupFn
  removeGroup: RemoveGroupFn
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

  const [groups, setGroups] = useState<GroupDoc[]>([])
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [favorites, setFavorites] = useState<DocumentDoc[]>([])
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    return true
  }) // Flag to manage whether this is the first time documents are loaded

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
   * Rename document by id
   */
  const toggleDocumentFavorite: ToggleDocumentFavoriteFn = async (
    documentId: string
  ) => {
    // TODO: replace with a db query (to avoid some potential issues and edge-cases)
    const original = documents.find((doc) => doc.id === documentId)

    if (original === undefined) {
      throw new Error(`no document found matching this id (${documentId})`)
    }

    const updated = await original.update({
      $set: {
        isFavorite: !original.isFavorite,
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
        isFavorite: false,
        isDeleted: false,
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
   * Soft-Removes a document
   */
  const removeDocument: RemoveDocumentFn = useCallback(
    async (documentId: string) => {
      // TODO: findOne needs a NotRemoved variant
      const original = await db.documents
        .findOne()
        .where("id")
        .eq(documentId)
        .exec()

      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      // TODO: figure out what the returned boolean means
      return original.softRemove()
    },
    [db.documents]
  )

  /**
   * Restore document by id
   */
  const restoreDocument: RestoreDocumentFn = useCallback(
    async (documentId: string) => {
      // TODO: replace with a db query (to avoid some potential issues and edge-cases)
      const original = await db.documents
        .findOne()
        .where("id")
        .eq(documentId)
        .exec()

      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      const parentGroup = await db.groups
        .findOne()
        .where("id")
        .eq(original.parentGroup)
        .exec()

      const updated = await original.update({
        $set: {
          isDeleted: false,
          // if the parent group doesn't exist set it to null to restore at tree root
          parentGroup: parentGroup ? parentGroup.id : null,
        },
      })

      // TODO: error handling

      return updated as DocumentDoc
    },
    [db.documents, db.groups]
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
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId: string, name: string) => {
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
    },
    [db.groups]
  )

  /**
   * Handles deleting groups and its children
   */
  const removeGroup: RemoveGroupFn = useCallback(
    async (groupId: string) => {
      // TODO: consider creating findById static methods on all collections that will abstract this query
      const original = await db.groups.findOne().where("id").eq(groupId).exec()

      if (original === null) {
        throw new Error(`no group found matching this id (${groupId})`)
      }

      // TODO: figure out what the returned boolean means
      return original.remove()
    },
    [db.groups]
  )

  const switchDocument: SwitchDocumentFn = (id: string | null) => {
    setCurrentEditor(id)
  }

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
  }, [db.documents, db.groups, isInitialLoad, updateDocumentsList])

  useEffect(() => {
    if (documents && documents[0]) {
      setCurrentEditor(documents[0].id)
    }
    // TODO: purpusefully ignoring the deps as this is only supposed to run once but this might be problematic if it fails the first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        favorites,
        documents,
        isLoading,
        toggleDocumentFavorite,
        switchDocument,
        newDocument,
        saveDocument,
        removeDocument,
        restoreDocument,
        renameDocument,
        newGroup,
        removeGroup,
        renameGroup,
        moveDocumentToGroup,
      }}
    >
      {children}
    </MainStateContext.Provider>
  )
}
