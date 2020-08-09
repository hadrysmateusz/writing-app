import React, { useState, useCallback, useEffect } from "react"
import { useEditor } from "slate-react"
import { Subscription } from "rxjs"
import { v4 as uuidv4 } from "uuid"

import { deserialize, serialize } from "../Editor/serialization"
import { useDatabase, DocumentDoc, GroupDoc } from "../Database"
import { useEditorState, defaultEditorValue } from "../EditorStateProvider"
import { useViewState } from "../View"

import { listenForIpcEvent } from "../../utils"
import createContext from "../../utils/createContext"

import {
  DocumentsAPI,
  GroupsAPI,
  CreateDocumentFn,
  RenameDocumentFn,
  MoveDocumentToGroupFn,
  ToggleDocumentFavoriteFn,
  RemoveDocumentFn,
  RestoreDocumentFn,
  DocumentUpdater,
  FindDocumentByIdFn,
  UpdateDocumentFn,
  FindDocumentsFn,
  CreateGroupFn,
  RenameGroupFn,
  RemoveGroupFn,
  PermanentlyRemoveDocumentFn,
  SaveDocumentFn,
  UpdateCurrentDocumentFn,
  SwitchDocumentFn,
  MainState,
} from "./types"

declare global {
  interface Window {
    ipcRenderer: any
  }
}

export const [
  useDocumentsAPI,
  DocumentsAPIProvider,
  DocumentsAPIContext,
] = createContext<DocumentsAPI>()

export const [
  useGroupsAPI,
  GroupsAPIProvider,
  GroupsAPIContext,
] = createContext<GroupsAPI>()

export const [
  useMainState,
  MainStateProvider,
  MainStateContext,
] = createContext<MainState>()

export const MainProvider: React.FC<{}> = ({ children }) => {
  const db = useDatabase()
  const editor = useEditor()
  const { primarySidebar } = useViewState()
  const {
    editorValue,
    isModified,
    setEditorValue,
    setIsModified,
  } = useEditorState()

  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<GroupDoc[]>([])
  const [documents, setDocuments] = useState<DocumentDoc[]>([])
  const [favorites, setFavorites] = useState<DocumentDoc[]>([])
  const [currentEditor, setCurrentEditor] = useState<string | null>(null)
  const [currentDocument, setCurrentDocument] = useState<DocumentDoc | null>(
    null
  )
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

  /**
   * Creates a new group under the provided parent group
   */
  const createGroup: CreateGroupFn = useCallback(
    async (parentGroup, values, options = {}) => {
      const { switchTo = true } = options

      const groupId = uuidv4()

      const newGroup = await db.groups.insert({
        id: groupId,
        name: "",
        parentGroup: parentGroup,
        ...values,
      })

      if (switchTo) {
        // this timeout is needed because of the way the sidebar looks for groups - it fetches them once and does a search on the array
        // TODO: that behavior should probably be replaced by a normal query for the group id (maybe with an additional cache layer) and this should eliminate the need for this timeout
        // TODO: to make it even smoother I could make it so that the switch is instant (even before the collection is created) and the sidebar waits for it to be created, this would require the sidebar to not default to all documents view on an unfound group id and for groups to be soft deleted so that if it's deleted it can go to the all documents view and maybe show a notification saying that the group you were looking for was deleted (or simply an empty state saying the same requiring the user to take another action) and if it wasn't deleted but isn't found to simply wait for it to be created (there should be a timeout of course if something went wrong and maybe even internal state that could show an error/empty state if there was an issue with creating the group)
        setTimeout(() => {
          primarySidebar.switchView(groupId)
        }, 100)
      }

      return newGroup
    },
    [db.groups, primarySidebar]
  )

  /**
   * Rename group by id
   */
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId, name) => {
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
    async (groupId) => {
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

  /**
   * Finds a single document by id
   *
   * TODO: figure out better naming to separate this from findDocuments
   */
  const findDocumentById: FindDocumentByIdFn = useCallback(
    async (
      /**
       * Id of the document
       */
      id: string,
      /**
       * Whether the query should consider removed documents
       */
      includeRemoved: boolean = false
    ) => {
      if (includeRemoved) {
        return await db.documents.findOne().where("id").eq(id).exec()
      } else {
        return await db.documents.findOneNotRemoved().where("id").eq(id).exec()
      }
    },
    [db.documents]
  )

  /**
   * Constructs a basic query for finding documents
   *
   * TODO: figure out better naming to separate this from findDocumentById
   */
  const findDocuments: FindDocumentsFn = useCallback(
    (
      /**
       * Whether the query should consider removed documents
       */
      includeRemoved: boolean = false
    ) => {
      if (includeRemoved) {
        return db.documents.find()
      } else {
        return db.documents.findNotRemoved()
      }
    },
    [db.documents]
  )

  /**
   * Updates the document using an object or function
   *
   * TODO: create an advanced version of the function that uses the full mongo update syntax: https://docs.mongodb.com/manual/reference/operator/update-field/
   */
  const updateDocument: UpdateDocumentFn = useCallback(
    async (
      id: string,
      updater: DocumentUpdater,
      includeRemoved: boolean = false
    ) => {
      const original = await findDocumentById(id, includeRemoved)
      if (original === null) {
        throw new Error(`no document found matching this id (${id})`)
      }
      // TODO: this can be extracted for use with other collections
      // TODO: handle errors (especially the ones thrown in pre-middleware because they mean the operation wasn't applied) (maybe handle them in more specialized functions like rename and save)
      const updatedDocument: DocumentDoc = await original.update(
        typeof updater === "function"
          ? { $set: updater(original) }
          : { $set: updater }
      )
      return updatedDocument
    },
    [findDocumentById]
  )

  /**
   * Handles creating a new document
   */
  const createDocument: CreateDocumentFn = useCallback(
    async (parentGroup: string | null, values, options = {}) => {
      const { switchTo = true } = options

      // TODO: consider using null value for content for empty documents

      const timestamp = Date.now()
      const docId = uuidv4()

      const newDocument = await db.documents.insert({
        id: docId,
        title: "",
        content: JSON.stringify(defaultEditorValue),
        parentGroup: parentGroup,
        createdAt: timestamp,
        modifiedAt: timestamp,
        isFavorite: false,
        isDeleted: false,
        ...values,
      })

      if (switchTo) {
        switchDocument(docId)
      }

      return newDocument
    },
    [db.documents, switchDocument]
  )

  /**
   * Rename document by id
   */
  const renameDocument: RenameDocumentFn = useCallback(
    async (documentId: string, title: string) => {
      return updateDocument(documentId, { title: title.trim() }, true)
    },
    [updateDocument]
  )

  /**
   * Move document to a different group
   */
  const moveDocumentToGroup: MoveDocumentToGroupFn = useCallback(
    async (documentId: string, groupId: string | null) => {
      // TODO: not sure if this function should include removed documents
      return updateDocument(documentId, { parentGroup: groupId }, true)
    },
    [updateDocument]
  )

  /**
   * Toggle the favorited status of a document
   */
  const toggleDocumentFavorite: ToggleDocumentFavoriteFn = useCallback(
    async (
      documentId: string,
      /**
       * A value that it should be set to no matter what it is now
       */
      overrideValue?: boolean
    ) => {
      return updateDocument(documentId, (original) => ({
        isFavorite: overrideValue ?? !original.isFavorite,
      }))
    },
    [updateDocument]
  )

  /**
   * Soft-Removes a document
   */
  const removeDocument: RemoveDocumentFn = useCallback(
    async (documentId: string) => {
      const original = await findDocumentById(documentId)
      if (original === null) {
        throw new Error(
          `no document found matching this id (${documentId}) (it might already be removed)`
        )
      }

      try {
        await original.softRemove()
        return true
      } catch (error) {
        // TODO: return this and create a system to show when something like this fails
        console.warn("The document was not removed")
        return false
      }
    },
    [findDocumentById]
  )

  /**
   * Permanently removes a document
   *
   * TODO: switch to another document or empty state after deleting
   */
  const permanentlyRemoveDocument: PermanentlyRemoveDocumentFn = useCallback(
    async (documentId: string) => {
      const original = await findDocumentById(documentId, true)
      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      try {
        await original.remove()
        return true
      } catch (error) {
        // TODO: return this and create a system to show when something like this fails
        console.warn("The document was not removed")
        return false
      }
    },
    [findDocumentById]
  )

  /**
   * Restore document by id
   */
  const restoreDocument: RestoreDocumentFn = useCallback(
    async (documentId: string) => {
      const original = await findDocumentById(documentId, true)
      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      // TODO: this query will be unnecessary if I decide to always restore at root
      const parentGroup = await db.groups
        .findOne()
        .where("id")
        .eq(original.parentGroup)
        .exec()

      const updated = await updateDocument(
        documentId,
        {
          isDeleted: false,
          // if the parent group doesn't exist set it to null to restore at tree root
          parentGroup: parentGroup ? parentGroup.id : null,
        },
        true
      )

      return updated
    },
    [db.groups, findDocumentById, updateDocument]
  )

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

  // TODO: figure out a way to reduce duplication of these queries
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

  useEffect(
    () =>
      // Handle "new-document" messages from the main process
      listenForIpcEvent("new-cloud-document", () => {
        // Remove domSelection to prevent errors
        window.getSelection()?.removeAllRanges()
        // Create the new document
        // TODO: maybe infer the collection somehow from the current document or something else
        createNewDocument()
      }),
    [createNewDocument]
  )

  return (
    <MainStateProvider
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
      <DocumentsAPIProvider
        value={{
          toggleDocumentFavorite,
          createDocument,
          removeDocument,
          permanentlyRemoveDocument,
          restoreDocument,
          renameDocument,
          moveDocumentToGroup,
          findDocumentById,
          updateDocument,
          findDocuments,
        }}
      >
        <GroupsAPIProvider
          value={{
            removeGroup,
            renameGroup,
            createGroup,
          }}
        >
          {children}
        </GroupsAPIProvider>
      </DocumentsAPIProvider>
    </MainStateProvider>
  )
}

export * from "./types"
