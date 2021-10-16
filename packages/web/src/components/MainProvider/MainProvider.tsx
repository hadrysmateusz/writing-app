import { Descendant } from "slate"
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  memo,
  useReducer,
} from "react"
import { Subscription } from "rxjs"
import { RxChangeEvent } from "rxdb"
import { v4 as uuidv4 } from "uuid"
import mudder from "mudder"
import isElectron from "is-electron"

import { useViewState, PrimarySidebarViews, CloudViews } from "../ViewState"
import { useModal } from "../Modal"
import {
  useDatabase,
  DocumentDoc,
  GroupDoc,
  useSyncState,
  MyDatabase,
} from "../Database"
import { useLocalSettings } from "../LocalSettings"

import { GROUP_TREE_ROOT } from "../../constants"
import { createContext } from "../../utils"

import {
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
  UpdateCurrentDocumentFn,
  ChangeSortingFn,
  Sorting,
  FindGroupByIdFn,
  UpdateGroupFn,
  MoveGroupFn,
  OpenDocumentFn,
} from "./types"
import {
  MainStateContext,
  GroupsAPIContext,
  DocumentsAPIContext,
  useDocumentsAPI,
  useGroupsAPI,
  useMainState,
} from "./context"
import { cancelSubscriptions } from "./helpers"
import { ConfirmDeleteModalContent } from "./ConfirmDeleteModalContent"
import { TabsReducer, tabsReducer, TabsState } from "./tabsSlice"
import AppLoadingState from "./AppLoadingState"

const m = mudder.base62

const DEFAULT_EDITOR_VALUE: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
]

export const [TabsStateContext, useTabsState] = createContext<TabsState>()

const createGroupsQuery = (db: MyDatabase) =>
  db.groups.find().sort({ position: "desc" })

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query
// TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.

export const MainProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()
  const {
    tabs: initialTabs,
    unsyncedDocs,
    updateLocalSetting,
  } = useLocalSettings()
  const { primarySidebar } = useViewState()
  const syncState = useSyncState()

  // TODO: remove the central groups list and replace with querying the local database where needed
  const [groups, setGroups] = useState<GroupDoc[]>([])

  // Flag to manage whether this is the first time the app is loaded
  const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(true)
  // Current document - the actual document object of the current document
  // TODO: when tabs are implemented this should probably be handled by individual tabs and shared through context
  const [currentDocument, setCurrentDocument] = useState<DocumentDoc | null>(
    null
  )

  const tabsReducer_ = useMemo(() => {
    return tabsReducer((value: TabsState) => {
      // the set timeout is necessary to prevent an error caused by updating another component's state while this one is rendering
      setTimeout(() => {
        updateLocalSetting("tabs", value)
      }, 0)
    })
  }, [updateLocalSetting])

  const [tabsState, tabsDispatch] = useReducer<TabsReducer>(
    tabsReducer_,
    initialTabs
  )

  const closeTab = useCallback((tabId) => {
    tabsDispatch({ type: "close-tab", tabId })
  }, [])

  // console.log("TABS STATE:", JSON.stringify(tabsState, null, 2))

  // TODO: figure out if I should keep this or just use tabsState.currentTab
  const currentDocumentId = useMemo(() => {
    let currentDocumentId
    if (tabsState.currentTab === null) {
      currentDocumentId = null
    } else {
      if (tabsState.tabs[tabsState.currentTab]) {
        currentDocumentId = tabsState.tabs[tabsState.currentTab].documentId
      } else {
        currentDocumentId = null
      }
    }
    return currentDocumentId
  }, [tabsState.currentTab, tabsState.tabs])

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
          primarySidebar.switchSubview(PrimarySidebarViews.cloud, newGroupId)
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

  /**
   * Rename group by id
   */
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId, name) => {
      return updateGroup(groupId, { name: name.trim() })
    },
    [updateGroup]
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

  //#region sync state

  // Handles removing documents from unsynced array when they get replicated
  useEffect(() => {
    const sub = syncState.documents?.replicationState.change$.subscribe(
      (observer) => {
        if (observer.direction === "push") {
          const syncedDocs = observer.change.docs.map((doc) => doc._id)

          const tempUnsyncedDocs = unsyncedDocs.filter(
            (doc) => !syncedDocs.includes(doc)
          )

          updateLocalSetting("unsyncedDocs", tempUnsyncedDocs)
        }
      }
    )

    return () => sub && sub.unsubscribe()
  }, [syncState.documents, unsyncedDocs, updateLocalSetting])

  // Handles marking documents as unsynced when they are created, updated or deleted
  useEffect(() => {
    // Subscribes to changes on the documents collection
    const sub = db.documents.$.subscribe(
      (event: RxChangeEvent<DocumentDoc>) => {
        const { documentData, isLocal, documentId } = event

        // TODO: I think this might mark documents as changed even when the change is coming FROM the server, make sure that doesn't happen
        // TODO: make sure that DELETE operations are handled properly, the code below is most likely not enough

        if (!documentData) {
          console.log("Skipping. No documentData in the event")
          return
        }

        if (isLocal) {
          console.log(`Skipping. Document ${documentId} is local.`)
          return
        }

        // Add document id to unsynced docs list, if it's not already in it
        if (!unsyncedDocs.includes(documentId)) {
          updateLocalSetting("unsyncedDocs", [...unsyncedDocs, documentId])
        }
      }
    )

    return () => sub.unsubscribe()
  }, [db.documents.$, unsyncedDocs, updateLocalSetting])

  //#endregion

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

  const fetchDocument = useCallback(
    async function (documentId: string | null) {
      if (documentId === null) {
        setCurrentDocument(null)
        return null
      }

      setIsDocumentLoading(true)
      const documentDoc = await findDocumentById(documentId, true)
      setIsDocumentLoading(false)
      if (!documentDoc) {
        // TODO: maybe handle this more gracefully
        throw new Error(`Document with id: ${documentId} wasn't found`)
      }
      setCurrentDocument(documentDoc)
      return documentDoc
    },
    [findDocumentById]
  )

  const openDocument = useCallback<OpenDocumentFn>(
    async function (documentId, options = {}) {
      const { inNewTab = false } = options

      // console.log("switching document to", documentId)

      if (documentId !== null) {
        // check if tab with this documentId already exists
        let tabId: string | null = null
        for (let [id, tab] of Object.entries(tabsState.tabs)) {
          if (tab.documentId === documentId) {
            tabId = id
          }
        }

        if (tabId !== null) {
          tabsDispatch({ type: "switch-tab", tabId })
        } else if (currentDocumentId === null || inNewTab) {
          tabsDispatch({
            type: "create-tab",
            documentId: documentId,
            switch: true,
          })
        } else if (tabsState.currentTab !== null) {
          tabsDispatch({
            type: "change-document",
            tabId: tabsState.currentTab,
            documentId: documentId,
          })
        } else {
          throw new Error("Couldn't open document")
        }
      }

      return fetchDocument(documentId)
    },
    [currentDocumentId, fetchDocument, tabsState.currentTab, tabsState.tabs]
  )

  /**
   * Handles creating a new document
   * TODO: switchToDocument (and especially their defaults) cause a lot of hard to spot bugs, figure out a way to better handle this (maybe remove this functionality from here or create a separate wrapper function to handle these functionalities or at least make them required instead of optional)
   * TODO: think about how this function should co-exist with the openDocument function and how their functionalities overlap
   * TODO: maybe
   */
  const createDocument: CreateDocumentFn = useCallback(
    async (parentGroup, values = {}, options = {}) => {
      const { switchToDocument = true, switchToGroup = true } = options
      const { title = "", content = DEFAULT_EDITOR_VALUE } = values

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
        openDocument(docId)
      }

      if (switchToGroup) {
        // If current view is all documents and the document is created at the root, don't switch
        if (
          !(
            primarySidebar.currentView === CloudViews.ALL &&
            parentGroup === null
          )
        ) {
          primarySidebar.switchSubview(
            PrimarySidebarViews.cloud,
            parentGroup ?? CloudViews.INBOX
          )
        }
      }

      return newDocument
    },
    [db.documents, primarySidebar, openDocument]
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
        if (currentDocumentId === null) {
          throw new Error("no document is currently selected")
        }
        const updatedDocument = await updateDocument(
          currentDocumentId,
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
    [currentDocumentId, updateDocument]
  )

  //#region deletion confirmation modal

  // The document deletion confirmation modal
  const { open: openConfirmDeleteModal, Modal: ConfirmDeleteModal } = useModal<
    boolean,
    {
      documentId: string | null
    }
  >(false, { documentId: null })

  /**
   * Permanently removes a document
   */
  const permanentlyRemoveDocument: PermanentlyRemoveDocumentFn = useCallback(
    (documentId: string) => {
      openConfirmDeleteModal({ documentId })
    },
    [openConfirmDeleteModal]
  )

  //#endregion

  /**
   * Handles setting up the group subscription
   */
  useEffect(() => {
    let groupsSub: Subscription | undefined

    groupsSub = createGroupsQuery(db).$.subscribe((newGroups) => {
      setGroups(newGroups)
    })

    return () => {
      cancelSubscriptions(groupsSub)
    }
  }, [db])

  /**
   * Fetches all things required for the app to run
   */
  useEffect(() => {
    if (isInitialLoad) {
      ;(async () => {
        setIsInitialLoad(false)

        const groupsPromise = createGroupsQuery(db).exec()
        // TODO: this can fail if root group can't be found / created - handle this properly
        const [newGroups] = await Promise.all([groupsPromise])

        if (currentDocumentId === null) {
          const document = await createDocument(null, undefined, {
            switchToDocument: false,
            switchToGroup: false,
          })
          setCurrentDocument(document)
          setIsDocumentLoading(false)
          tabsDispatch({
            type: "create-tab",
            documentId: document.id,
            switch: true,
          })
        } else {
          await fetchDocument(currentDocumentId)
        }

        setGroups(newGroups)
      })()
    }
  }, [
    createDocument,
    fetchDocument,
    currentDocumentId,
    db,
    isDocumentLoading,
    isInitialLoad,
    tabsState.tabs,
  ])

  useEffect(() => {
    // If there's no tabs create a new one
    // We check value of isDocument loading to prevent multiple tabs/documents being created at once
    if (Object.keys(tabsState.tabs).length === 0 && !isDocumentLoading) {
      setIsDocumentLoading(true)
      createDocument(null, undefined, {
        switchToDocument: false,
      }).then((document) => {
        setCurrentDocument(document)
        tabsDispatch({
          type: "create-tab",
          documentId: document.id,
          switch: true,
        })
        setIsDocumentLoading(false)
      })
    }
  }, [createDocument, isDocumentLoading, tabsState.tabs])

  //#region sorting

  // State of the sorting options for the documents list
  // TODO: persist this locally
  // TODO: make this a per-collection setting
  // TODO: make sorting not take uppercase/lowercase into consideration (probably by having a separate 'slugTitle' field)
  const [sorting, setSorting] = useState<Sorting>({
    index: "title",
    direction: "desc",
  })
  /**
   * Changes the sorting options for the documents list
   */
  const changeSorting: ChangeSortingFn = useCallback((index, direction) => {
    setSorting({ index, direction })
  }, [])

  //#endregion sorting

  // TODO: I could extract this to a custom hook for listening to ipc events
  useEffect(() => {
    if (isElectron()) {
      // Handle "new-document" messages from the main process
      return window.electron.subscribe("NEW_CLOUD_DOCUMENT", () => {
        // Remove domSelection to prevent errors
        window.getSelection()?.removeAllRanges()
        // Create the new document
        // TODO: maybe infer the collection somehow from the current document or something else
        createDocument(null)
      })
    }
    return undefined
  }, [createDocument])

  const mainState = useMemo(
    () => ({
      currentDocumentId,
      currentDocument,
      isDocumentLoading,
      groups,
      sorting,
      unsyncedDocs,
      updateCurrentDocument,
      changeSorting,
      openDocument,
      closeTab, // TODO: find a better place to expose this
    }),
    [
      currentDocumentId,
      currentDocument,
      isDocumentLoading,
      groups,
      sorting,
      unsyncedDocs,
      updateCurrentDocument,
      changeSorting,
      openDocument,
      closeTab,
    ]
  )
  const documentsAPI = useMemo(
    () => ({
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
    }),
    [
      createDocument,
      findDocumentById,
      findDocuments,
      moveDocumentToGroup,
      permanentlyRemoveDocument,
      removeDocument,
      renameDocument,
      restoreDocument,
      toggleDocumentFavorite,
      updateDocument,
    ]
  )
  const groupsAPI = useMemo(
    () => ({
      moveGroup,
      removeGroup,
      renameGroup,
      createGroup,
      updateGroup,
      findGroupById,
    }),
    [
      createGroup,
      findGroupById,
      moveGroup,
      removeGroup,
      renameGroup,
      updateGroup,
    ]
  )

  return (
    <MainStateContext.Provider value={mainState}>
      <DocumentsAPIContext.Provider value={documentsAPI}>
        <GroupsAPIContext.Provider value={groupsAPI}>
          <TabsStateContext.Provider value={tabsState}>
            <ConfirmDeleteModal component={ConfirmDeleteModalContent} />
            {isInitialLoad ? <AppLoadingState /> : children}
          </TabsStateContext.Provider>
        </GroupsAPIContext.Provider>
      </DocumentsAPIContext.Provider>
    </MainStateContext.Provider>
  )
})

// TODO: move the logic to separate files and only handle imports/exports in the index file
export {
  DocumentsAPIContext,
  GroupsAPIContext,
  MainStateContext,
  useDocumentsAPI,
  useGroupsAPI,
  useMainState,
}

export * from "./types"