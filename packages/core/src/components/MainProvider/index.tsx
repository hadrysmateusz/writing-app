import React, { useState, useCallback, useEffect, useMemo } from "react"
import { useEditor } from "slate-react"
import { Subscription } from "rxjs"
import { v4 as uuidv4 } from "uuid"
import mudder from "mudder"

import { useEditorState, defaultEditorValue } from "../EditorStateProvider"
import { deserialize, serialize } from "../Editor/serialization"
import { useViewState } from "../View"
import { useModal } from "../Modal"
import { useDatabase, DocumentDoc, GroupDoc } from "../Database"

import { VIEWS } from "../../constants"
import { listenForIpcEvent, createContext } from "../../utils"

import { ConfirmDeleteModalContent } from "./ConfirmDeleteModalContent"
import {
  DocumentsAPI,
  GroupsAPI,
  CreateDocumentFn,
  RenameDocumentFn,
  MoveDocumentToGroupFn,
  ToggleDocumentFavoriteFn,
  RemoveDocumentFn,
  RestoreDocumentFn,
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
  ChangeSortingFn,
  Sorting,
  FindGroupByIdFn,
  UpdateGroupFn,
  MoveGroupFn,
} from "./types"
import { GROUP_TREE_ROOT } from "../../constants"
import { useLocalSettings } from "../LocalSettings"

const m = mudder.base62

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

// TODO: make methods using IDs to find documents/groups/etc. accept the actual RxDB document object instead to skip the query

const cancelSubscription = (sub: Subscription | undefined) => {
  if (sub) {
    sub.unsubscribe()
  }
}

const cancelSubscriptions = (...subs: (Subscription | undefined)[]) => {
  subs.forEach((sub) => cancelSubscription(sub))
}

export const MainProvider: React.FC = ({ children }) => {
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
  const { currentEditor, updateLocalSetting } = useLocalSettings()

  // TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.

  // Current document - the actual document object of the current document
  // TODO: when tabs are implemented this should probably be handled by individual tabs and shared through context
  const [currentDocument, setCurrentDocument] = useState<DocumentDoc | null>(
    null
  )

  // Flag to manage whether this is the first time documents are loaded
  const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  // State of the sorting options for the documents list
  // TODO: persist this locally
  const [sorting, setSorting] = useState<Sorting>({
    index: "modifiedAt",
    direction: "desc",
  })

  // The document deletion confirmation modal
  const { open: openConfirmDeleteModal, Modal: ConfirmDeleteModal } = useModal<{
    documentId?: string
  }>(false)

  const index = sorting?.index ?? "modifiedAt"
  const direction = sorting?.direction ?? "desc"

  // Queries

  const groupsQuery = useMemo(() => {
    return db.groups.find().sort({ position: "desc" })
  }, [db.groups])

  const documentsQuery = useMemo(() => {
    return db.documents.findNotRemoved().sort({ [index]: direction })
  }, [db.documents, direction, index])

  const favoritesQuery = useMemo(() => {
    return db.documents
      .findNotRemoved()
      .where("isFavorite")
      .eq(true)
      .sort({ [index]: direction })
  }, [db.documents, direction, index])

  const setCurrentEditor = useCallback(
    (value: string | null) => {
      updateLocalSetting("currentEditor", value)
    },
    [updateLocalSetting]
  )

  /**
   * Finds a single group by id.
   *
   * Throws if the group can't be found.
   *
   * If can't find root group, it will attempt to create it.
   *
   * TODO: if soft-deleting groups is implemented, add an option and handling for removed groups like in findDocumentById
   *
   * TODO: if soft-deleting groups is implemented, consider creating a more generic function for both groups and documents
   */
  const findGroupById: FindGroupByIdFn = useCallback(
    async (id) => {
      let foundGroup = await db.groups.findOne().where("id").eq(id).exec()

      // // If was trying to find root group and failed, attempt to create it
      // if (foundGroup === null && id === ROOT_GROUP_ID) {
      //   foundGroup = await db.groups.createRootGroup()
      // }

      if (foundGroup === null) {
        throw new Error(`No group found matching this ID: ${id})`)
      }

      return foundGroup
    },
    [db.groups]
  )

  const updateDocumentsList = useCallback(
    (documents: DocumentDoc[]) => {
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
    },
    [setCurrentEditor]
  )

  /**
   * Switches the currently open document
   */
  const switchDocument: SwitchDocumentFn = useCallback(
    (id) => {
      setCurrentEditor(id)
    },
    [setCurrentEditor]
  )

  /**
   * Gets all things required for the app to run
   */
  useEffect(() => {
    if (isInitialLoad) {
      const performInitialSetup = async () => {
        const groupsPromise = groupsQuery.exec()
        const documentsPromise = documentsQuery.exec()
        // TODO: favorites can probably be moved into a separate hook as they are not needed for first load
        const favoritesPromise = favoritesQuery.exec()

        // TODO: this can fail if root group can't be found / created - handle this properly
        const [newGroups, newDocuments, newFavorites] = await Promise.all([
          groupsPromise,
          documentsPromise,
          favoritesPromise,
        ])

        // if current editor is set to null and there are new documents, switch to the first one
        // TODO: I should probably rethink my approach to this empty state
        if (newDocuments && newDocuments[0] && currentEditor === null) {
          switchDocument(newDocuments[0].id)
        }

        setIsInitialLoad(false)
        setGroups(newGroups)
        updateDocumentsList(newDocuments)
        setFavorites(newFavorites)
        setIsLoading(false)
      }
      performInitialSetup()
    }
  }, [
    currentEditor,
    documentsQuery,
    favoritesQuery,
    findGroupById,
    groupsQuery,
    isInitialLoad,
    switchDocument,
    updateDocumentsList,
  ])

  /**
   * Handles setting up critical subscriptions
   *
   * TODO: needs a significant rewrite
   */
  useEffect(() => {
    let documentsSub: Subscription | undefined
    let groupsSub: Subscription | undefined
    let favoritesSub: Subscription | undefined

    documentsSub = documentsQuery.$.subscribe((newDocuments) => {
      updateDocumentsList(newDocuments)
    })

    groupsSub = groupsQuery.$.subscribe((newGroups) => {
      setGroups(newGroups)
    })

    favoritesSub = favoritesQuery.$.subscribe((newFavorites) => {
      setFavorites(newFavorites)
    })

    return () => {
      cancelSubscriptions(documentsSub, groupsSub, favoritesSub)
    }
  }, [documentsQuery.$, favoritesQuery.$, groupsQuery.$, updateDocumentsList])

  /**
   * Handles changing all of the state and side-effects of switching editors
   *
   * TODO: this needs a significant rework for readability and reliability
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
   * Changes the sorting options for the documents list
   */
  const changeSorting: ChangeSortingFn = useCallback((index, direction) => {
    setSorting({ index, direction })
  }, [])

  //#region Groups

  /**
   * Creates a new group under the provided parent group
   */
  const createGroup: CreateGroupFn = useCallback(
    async (parentGroupId, values, options = {}) => {
      const { switchTo = true } = options

      // TODO: create a slug from the name and append uuid or shortid to make debugging easier
      const newGroupId = uuidv4()

      const lastSibling = await db.groups
        .findOne()
        .where("parentGroup")
        .eq(parentGroupId)
        .sort({ position: "desc" })
        .exec()

      const prevPosition = lastSibling?.position
      let newPosition = (prevPosition
        ? m.mudder(prevPosition, "Z", 1)
        : m.mudder(1))[0]

      console.log(lastSibling, newPosition)

      let newGroup: GroupDoc | undefined

      try {
        newGroup = await db.groups.insert({
          id: newGroupId,
          name: "",
          parentGroup: parentGroupId,
          position: newPosition,
          ...values,
        })
      } catch (error) {
        console.error("Failed to create the new group object")
        throw error
      }

      if (switchTo) {
        // this timeout is needed because of the way the sidebar looks for groups - it fetches them once and does a search on the array
        // TODO: that behavior should probably be replaced by a normal query for the group id (maybe with an additional cache layer) and this should eliminate the need for this timeout
        // TODO: to make it even smoother I could make it so that the switch is instant (even before the collection is created) and the sidebar waits for it to be created, this would require the sidebar to not default to all documents view on an unfound group id and for groups to be soft deleted so that if it's deleted it can go to the all documents view and maybe show a notification saying that the group you were looking for was deleted (or simply an empty state saying the same requiring the user to take another action) and if it wasn't deleted but isn't found to simply wait for it to be created (there should be a timeout of course if something went wrong and maybe even internal state that could show an error/empty state if there was an issue with creating the group)
        setTimeout(() => {
          primarySidebar.switchView(newGroupId)
        }, 100)
      }

      return newGroup
    },
    [db.groups, primarySidebar]
  )

  // TODO: special handling and protection for the root group
  const updateGroup: UpdateGroupFn = useCallback(
    async (id, updater) => {
      const original = await findGroupById(id)

      // TODO: this can be extracted for use with other collections
      // TODO: handle errors (especially the ones thrown in pre-middleware because they mean the operation wasn't applied) (maybe handle them in more specialized functions like rename and save)
      const updatedGroup: GroupDoc = await original.update(
        typeof updater === "function"
          ? { $set: updater(original) }
          : { $set: updater }
      )
      return updatedGroup
    },
    [findGroupById]
  )

  /**
   * Rename group by id
   */
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId, name) => {
      return updateGroup(groupId, { name: name.trim() })
    },
    [updateGroup]
  )

  /**
   * Handles deleting groups and its children
   */
  const removeGroup: RemoveGroupFn = useCallback(
    async (groupId) => {
      // TODO: consider creating findById static methods on all collections that will abstract this query
      const original = await findGroupById(groupId)

      // TODO: figure out what the returned boolean means
      return original.remove()
    },
    [findGroupById]
  )

  const moveGroup: MoveGroupFn = useCallback(
    async (
      /**
       * Id of group that will be moved
       */
      subjectId,
      /**
       * New position of the group
       *
       * The provided 0-based index will be translated into a proper "position"
       */
      index,
      /**
       * Id of the group that will be the new parent of the group
       */
      targetId
    ) => {
      try {
        // debugger

        if (targetId === GROUP_TREE_ROOT) {
          targetId = null
        }

        // Make sure that the group is not being moved inside one of its descendants (or itself)
        let descendantId = targetId
        while (descendantId !== null) {
          if (descendantId === subjectId) {
            console.info("can't move group inside one of its descendants")
            return false
          }
          const group = await findGroupById(descendantId)
          descendantId = group.parentGroup
        }

        const siblings = await db.groups
          .find()
          .where("parentGroup")
          .eq(targetId)
          .sort({ position: "asc" })
          .exec()

        // const oldIndex = siblings.findIndex((g) => g.id === subjectId)

        // const isMovingBefore = oldIndex > index

        // const prevIndex = isMovingBefore ? index - 1 : index
        // const nextIndex = isMovingBefore ? index : index + 1

        const prevIndex = index
        const nextIndex = index + 1

        const prevPosition = siblings[prevIndex]?.position ?? "0"
        const nextPosition = siblings[nextIndex]?.position ?? "Z"

        const newPosition = m.mudder(prevPosition, nextPosition, 1)[0]

        try {
          await updateGroup(subjectId, {
            parentGroup: targetId,
            position: newPosition,
          })
          return true
        } catch (error) {
          console.error(error) // TODO: better error handling
          return false
        }

        // TODO: consider replacing this with a method on the GroupDoc objects (with this becoming a wrapper that first fetches the group object from db by ID)
        // const subjectGroup = await findGroupById(subjectId)
        // const targetGroup = await findGroupById(targetId)
        // console.log("subjectGroup", subjectGroup)
        // console.log("targetGroup", targetGroup)
        // if (subjectGroup.parentGroup === null) {
        //   throw new Error("can't move root group")
        // }
        // // The parent doesn't change - only the order
        // if (subjectGroup.parentGroup === targetId) {
        //   // create the new childGroups array
        //   const newTargetChildGroups = [...targetGroup.childGroups]
        //   // find the current index of the subject group
        //   const oldIndexOfSubject = newTargetChildGroups.findIndex(
        //     (id) => id === subjectId
        //   )
        //   if (oldIndexOfSubject === -1) {
        //     // TODO: find a way to handle this gracefully
        //     throw new Error("Subject not found in parent")
        //   }
        //   console.log("oldIndex", oldIndexOfSubject)
        //   // TODO: depending on how the dnd library handles the new index, this might need changes when moving to a location after the old location
        //   // remove the subjectId from the array
        //   newTargetChildGroups.splice(oldIndexOfSubject, 1)
        //   // insert the subjectId at new index
        //   newTargetChildGroups.splice(index, 0, subjectId)
        //   console.log(targetGroup.childGroups, newTargetChildGroups)
        //   try {
        //     await updateGroup(targetId, { childGroups: newTargetChildGroups })
        //     return true
        //   } catch (error) {
        //     console.error(error) // TODO: better error handling
        //     return false
        //   }
        // } else {
        //   const oldParentGroupId = subjectGroup.parentGroup
        //   const oldParentGroup = await findGroupById(oldParentGroupId)
        //   const oldParentChildGroups = [...oldParentGroup.childGroups]
        //   const oldIndexOfSubject = oldParentChildGroups.findIndex(
        //     (id) => id === subjectId
        //   )
        //   if (oldIndexOfSubject === -1) {
        //     throw new Error("Subject not found in parent") // TODO: find a way to handle this gracefully
        //   }
        //   const newParentChildGroups = oldParentChildGroups.splice(
        //     oldIndexOfSubject,
        //     1
        //   )
        //   const newTargetChildGroups = [...targetGroup.childGroups].splice(
        //     index,
        //     0,
        //     subjectId
        //   )
        //   // remove the subject id from old parent group's childGroups list
        //   const updateParentPromise = updateGroup(oldParentGroupId, {
        //     childGroups: newParentChildGroups,
        //   })
        //   // add the subject id to new parent group's childGroups list
        //   const updateTargetPromise = updateGroup(targetId, {
        //     childGroups: newTargetChildGroups,
        //   })
        //   // change the parentGroup id on the subject group
        //   const updateSubjectPromise = updateGroup(subjectId, {
        //     parentGroup: targetId,
        //   })
        //   try {
        //     await Promise.all([
        //       updateParentPromise,
        //       updateTargetPromise,
        //       updateSubjectPromise,
        //     ])
        //     return true
        //   } catch (error) {
        //     console.error(error) // TODO: better error handling
        //     return false
        //   }
        // }
      } catch (error) {
        console.error(error) // TODO: better error handling
        return false
      }
    },
    [db.groups, findGroupById, updateGroup]
  )

  //#endregion

  //#region Documents

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
      includeRemoved = false
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
   * TODO: consider using atomicUpdate or atomicSet
   *
   * TODO: create an advanced version of the function that uses the full mongo update syntax: https://docs.mongodb.com/manual/reference/operator/update-field/
   */
  const updateDocument: UpdateDocumentFn = useCallback(
    async (id, updater, includeRemoved = false) => {
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
    async (parentGroup, values = {}, options = {}) => {
      const { switchToDocument = true, switchToGroup = true } = options
      const { title = "", content = defaultEditorValue } = values

      // TODO: consider using null value for content for empty documents

      const timestamp = Date.now()
      const docId = uuidv4()
      // TODO: consider custom serialization / compression / key-compression
      const serializedContent = JSON.stringify(content)

      const newDocument = await db.documents.insert({
        id: docId,
        title, // TODO: consider custom title sanitation / formatting
        content: serializedContent,
        parentGroup: parentGroup,
        createdAt: timestamp,
        modifiedAt: timestamp,
        isFavorite: false,
        isDeleted: false,
      })

      if (switchToDocument) {
        switchDocument(docId)
      }

      if (switchToGroup) {
        // If current view is all documents and the document is created at the root, don't switch
        if (
          !(primarySidebar.currentView === VIEWS.ALL && parentGroup === null)
        ) {
          primarySidebar.switchView(parentGroup ?? VIEWS.INBOX)
        }
      }

      return newDocument
    },
    [db.documents, primarySidebar, switchDocument]
  )

  /**
   * Rename document by id
   */
  const renameDocument: RenameDocumentFn = useCallback(
    async (documentId, title) => {
      return updateDocument(documentId, { title: title.trim() }, true)
    },
    [updateDocument]
  )

  /**
   * Move document to a different group
   */
  const moveDocumentToGroup: MoveDocumentToGroupFn = useCallback(
    async (documentId, groupId) => {
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
   */
  const permanentlyRemoveDocument: PermanentlyRemoveDocumentFn = useCallback(
    (documentId: string) => {
      openConfirmDeleteModal({ documentId })
    },
    [openConfirmDeleteModal]
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
    async (updater) => {
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

  //#endregion

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
        createDocument(null)
      }),
    [createDocument]
  )

  return (
    <MainStateProvider
      value={{
        currentEditor,
        currentDocument,
        groups,
        favorites,
        documents,
        isLoading,
        sorting,
        switchDocument,
        saveDocument,
        updateCurrentDocument,
        changeSorting,
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
            moveGroup,
            removeGroup,
            renameGroup,
            createGroup,
            updateGroup,
            findGroupById,
          }}
        >
          <ConfirmDeleteModal
            render={(props) => <ConfirmDeleteModalContent {...props} />}
          />
          {children}
        </GroupsAPIProvider>
      </DocumentsAPIProvider>
    </MainStateProvider>
  )
}

export * from "./types"
