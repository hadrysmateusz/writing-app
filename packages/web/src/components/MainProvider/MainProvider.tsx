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
import { v4 as uuidv4 } from "uuid"
import mudder from "mudder"
import isElectron from "is-electron"
import { cloneDeep } from "lodash"
import { ELEMENT_DEFAULT } from "@udecode/plate"

import { parseSidebarPath, usePrimarySidebar } from "../ViewState"
import { useModal } from "../Modal"
import {
  useDatabase,
  DocumentDoc,
  GroupDoc,
  // useSyncState,
  MyDatabase,
} from "../Database"
import { defaultLocalSettings, useLocalSettings } from "../LocalSettings"
import { serialize } from "../Editor/serialization"

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
  ConfirmDeleteModalProps,
  ActuallyPermanentlyDeleteTagFn,
  RenameTagFn,
  CreateTagFn,
} from "./types"
import {
  MainStateContext,
  GroupsAPIContext,
  DocumentsAPIContext,
  TagsAPIContext,
  useTagsAPI,
  useDocumentsAPI,
  useGroupsAPI,
  useMainState,
  TabsDispatchContext,
} from "./context"
import { cancelSubscriptions, getCurrentCloudDocumentId } from "./helpers"
import { ConfirmDeleteModalContent } from "./ConfirmDeleteModalContent"
import { TabsReducer, tabsReducer, TabsState } from "./tabsSlice"
import AppLoadingState from "./AppLoadingState"

const m = mudder.base62

export const DEFAULT_EDITOR_VALUE: Descendant[] = [
  { type: ELEMENT_DEFAULT, children: [{ text: "" }] },
]

export const [TabsStateContext, useTabsState] = createContext<TabsState>()

const createGroupsQuery = (db: MyDatabase) =>
  db.groups.find().sort({ position: "desc" })

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query
// TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.

/**
 * Checks tabs state for a tab with a cloud document with documentId matching the param
 * @returns tabId of the tab containing the document or null if such tab wasn't found
 */
function findTabWithDocumentId(
  tabsState: TabsState,
  documentId: string
): string | null {
  let foundTabId: string | null = null
  Object.entries(tabsState.tabs).some(([tabId, tab]) => {
    if (tab.tabType === "cloudDocument" && tab.documentId === documentId) {
      foundTabId = tabId
      return true
    }
    return false
  })
  return foundTabId
}

export const MainProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()
  const {
    // unsyncedDocs,
    getLocalSetting,
    updateLocalSetting,
  } = useLocalSettings()
  const primarySidebar = usePrimarySidebar()
  // const syncState = useSyncState()

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
    defaultLocalSettings.tabs
  )

  const closeTab = useCallback((tabId) => {
    tabsDispatch({ type: "close-tab", tabId })
  }, [])

  // console.log("TABS STATE:", JSON.stringify(tabsState, null, 2))

  useEffect(() => {
    // TODO: check if this actually does something
    if (tabsState.currentTab === null) {
      const tabIds = Object.keys(tabsState.tabs)
      if (tabIds.length >= 1) {
        tabsDispatch({ type: "switch-tab", tabId: tabIds[0] })
      } else {
        tabsDispatch({ type: "create-tab", tabType: "cloudNew", switch: true })
      }
    }
  }, [tabsState.currentTab, tabsState.tabs])

  const currentDocumentId = getCurrentCloudDocumentId(tabsState)

  // console.log("currentDocumentId", currentDocumentId)

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
          primarySidebar.switchSubview("cloud", "group", newGroupId)
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

  // // Handles removing documents from unsynced array when they get replicated
  // useEffect(() => {
  //   const sub = syncState.documents?.replicationState.change$.subscribe(
  //     (observer) => {
  //       if (observer.direction === "push") {
  //         const syncedDocs = observer.change.docs.map((doc) => doc._id)

  //         const tempUnsyncedDocs = unsyncedDocs.filter(
  //           (doc) => !syncedDocs.includes(doc)
  //         )

  //         updateLocalSetting("unsyncedDocs", tempUnsyncedDocs)
  //       }
  //     }
  //   )

  //   return () => sub && sub.unsubscribe()
  // }, [syncState.documents, unsyncedDocs, updateLocalSetting])

  // // Handles marking documents as unsynced when they are created, updated or deleted
  // useEffect(() => {
  //   // Subscribes to changes on the documents collection
  //   const sub = db.documents.$.subscribe(
  //     (event: RxChangeEvent<DocumentDoc>) => {
  //       const { documentData, isLocal, documentId } = event

  //       // TODO: I think this might mark documents as changed even when the change is coming FROM the server, make sure that doesn't happen
  //       // TODO: make sure that DELETE operations are handled properly, the code below is most likely not enough

  //       if (!documentData) {
  //         console.log("Skipping. No documentData in the event")
  //         return
  //       }

  //       if (isLocal) {
  //         console.log(`Skipping. Document ${documentId} is local.`)
  //         return
  //       }

  //       // Add document id to unsynced docs list, if it's not already in it
  //       if (!unsyncedDocs.includes(documentId)) {
  //         updateLocalSetting("unsyncedDocs", [...unsyncedDocs, documentId])
  //       }
  //     }
  //   )

  //   return () => sub.unsubscribe()
  // }, [db.documents.$, unsyncedDocs, updateLocalSetting])

  //#endregion

  const createTag: CreateTagFn = useCallback(
    async (values) => {
      const { name } = values

      // Trim the name to remove unwanted whitespace
      const trimmedName = name.trim()
      if (trimmedName === "") {
        throw new Error("name can't be empty")
      }

      // Slugify the name (no timestamp added, tag names are supposed to be unique)
      // TODO: extract tag slug computing logic
      const nameSlug = encodeURI(trimmedName.toLowerCase())

      // Check for tags with the same name
      // TODO: fix the likely issue of creating the same tag on different devices, causing errors on sync
      const foundTag = await db.tags
        .findOne()
        .where("nameSlug")
        .eq(nameSlug)
        .exec()
      if (foundTag !== null) {
        // throw new Error("tag with this nameSlug already exists")
        console.warn("tag with this nameSlug already exists")
        return null
      } else {
        const tagId = uuidv4()

        const newTag = await db.tags.insert({
          id: tagId,
          name: trimmedName,
          nameSlug,
        })

        return newTag
      }
    },
    [db.tags]
  )

  const actuallyPermanentlyDeleteTag: ActuallyPermanentlyDeleteTagFn = useCallback(
    async (id) => {
      // TODO: add a confirmation dialog step before this
      const tag = await db.tags.findOne().where("id").eq(id).exec()
      if (tag === null) {
        throw new Error(`no tag found matching this id (${id})`)
      }
      try {
        await tag.remove()
      } catch (e) {
        // TODO: better surface this error to the user
        console.log("error while deleting document")
        throw e
      }

      // TODO: remove tag from all documents (probably handled with a preRemove hook)
    },
    [db.tags]
  )

  const renameTag: RenameTagFn = useCallback(
    async (id, name) => {
      // Trim the name to remove unwanted whitespace
      // TODO: remove duplication with create tag function (maybe a unified validator/sanitizer function)
      const trimmedName = name.trim()
      if (trimmedName === "") {
        throw new Error("name can't be empty")
      }

      const originalTag = await db.tags.findOne().where("id").eq(id).exec()
      if (originalTag === null) {
        throw new Error(`no tag found matching this id (${id})`)
      }

      if (trimmedName === originalTag.name) {
        console.log("Name was the same. Update aborted.")
        return originalTag
      }

      // Slugify the name (no timestamp added, tag names are supposed to be unique)
      // TODO: extract tag slug computing logic
      const nameSlug = encodeURI(trimmedName.toLowerCase())

      try {
        const updatedTag = await originalTag.update({
          $set: { name: trimmedName, nameSlug },
        })
        return updatedTag
      } catch (e) {
        // TODO: better surface this error to the user
        console.log("error while editing tag")
        throw e
      }
    },
    [db.tags]
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
      setCurrentDocument(cloneDeep(documentDoc))
      return documentDoc
    },
    [findDocumentById]
  )

  /**
   * Opens a cloud document in the editor
   */
  const openDocument = useCallback<OpenDocumentFn>(
    async function (documentId, options = {}) {
      const { inNewTab = true } = options

      console.log("openDocument called", documentId, options)

      // Check if tab with this documentId already exists
      const tabId = findTabWithDocumentId(tabsState, documentId)
      // Tab with this document already exists, switch to it
      if (tabId !== null) {
        tabsDispatch({ type: "switch-tab", tabId })
      } else {
        const tempTab = Object.values(tabsState.tabs).find(
          (tab) => tab.keep === false
        )
        // if there is a tab with keep === false, we reuse that tab
        if (!!tempTab) {
          tabsDispatch({
            type: "replace-tab",
            tab: {
              tabId: tempTab.tabId,
              tabType: "cloudDocument",
              documentId: documentId,
              keep: false,
            },
            switch: true,
          })
        }
        // Open document in new tab
        else if (currentDocumentId === null || inNewTab) {
          tabsDispatch({
            type: "create-tab",
            tabType: "cloudDocument",
            documentId: documentId,
            switch: true,
          })
        }
        // Open document in current tab
        else if (tabsState.currentTab !== null) {
          // TODO: this currently doesn nothing (figure out what to do with it)
          tabsDispatch({
            type: "change-document",
            tabId: tabsState.currentTab,
            documentId: documentId,
          })
        }
        // Invalid scenario
        else {
          throw new Error("Couldn't open document")
        }
      }

      return fetchDocument(documentId)
    },
    [currentDocumentId, fetchDocument, tabsState]
  )

  /**
   * Handles creating a new document
   * TODO: switchToDocument (and especially their defaults) cause a lot of hard to spot bugs, figure out a way to better handle this (maybe remove this functionality from here or create a separate wrapper function to handle these functionalities or at least make them required instead of optional)
   * TODO: think about how this function should co-exist with the openDocument function and how their functionalities overlap
   */
  const createDocument: CreateDocumentFn = useCallback(
    async (values, options = {}) => {
      const {
        parentGroup,
        title = "",
        content = serialize(DEFAULT_EDITOR_VALUE),
        tags = [],
      } = values
      const { switchToDocument = true, switchToGroup = true } = options

      console.log("createDocument called", parentGroup, values, options)

      // TODO: consider using null value for content for empty documents

      const timestamp = Date.now()
      const docId = uuidv4()

      const titleSlug = encodeURI(title.toLowerCase() + Date.now()) // TODO: extract titleSlug computing logic

      const newDocument = await db.documents.insert({
        id: docId,
        title, // TODO: consider custom title sanitation / formatting
        titleSlug,
        content,
        parentGroup,
        tags,
        createdAt: timestamp,
        modifiedAt: timestamp,
        isFavorite: false,
        isDeleted: false,
      })

      if (switchToDocument) {
        openDocument(docId)
      }

      if (switchToGroup) {
        if (parentGroup) {
          // If parent group was provided we switch to that group's subview
          primarySidebar.switchSubview("cloud", "group", parentGroup)
        } else {
          const parsedCurrentPath = parseSidebarPath(
            primarySidebar.currentSubviews[primarySidebar.currentView]
          )
          // Switch to inbox view unless current view is all documents view, in which case we stay there
          if (
            !(
              parsedCurrentPath?.view === "cloud" &&
              parsedCurrentPath?.subview === "all"
            )
          ) {
            // Otherwise we switch to inbox
            primarySidebar.switchSubview("cloud", "inbox")
          }
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
    ConfirmDeleteModalProps
  >(false, { all: false, documentId: null })

  /**
   * Permanently removes a document
   */
  const permanentlyRemoveDocument: PermanentlyRemoveDocumentFn = useCallback(
    (documentId: string) => {
      openConfirmDeleteModal({ all: false, documentId })
    },
    [openConfirmDeleteModal]
  )

  const permanentlyRemoveAllDocuments = useCallback(() => {
    openConfirmDeleteModal({ all: true, documentId: undefined })
  }, [openConfirmDeleteModal])

  // TODO: fix naming with this and the function that opens the confirm deletion modal
  const actuallyPermanentlyRemoveDocument = useCallback(
    async (documentId: string) => {
      console.log("actuallyPermanentlyRemoveDocument", documentId)

      const original = await findDocumentById(documentId, true)
      if (original === null) {
        throw new Error(`no document found matching this id (${documentId})`)
      }

      console.log("found document:", original)

      try {
        await original.remove()
        console.log("document was removed")
      } catch (error) {
        // TODO: better surface this error to the user
        console.error("The document was not removed")
      }
      // // check if document is open in a tab and close it
      // let foundTabId = findTabWithDocumentId(tabsState, documentId)
      // console.log(foundTabId)
      // if (foundTabId !== null) {
      //   closeTab(foundTabId)
      // }
    },
    [findDocumentById]
  )

  // TODO: permanently removing documents seems to have stopped working and actually restores the documents (this might be caused by the new tags database creating sync issues and deleted documents being pushed from cloud db to client db, but I doubt that)
  // TODO: rename to something like clearTrashDocuments or sth
  const actuallyPermanentlyRemoveAllDocuments = useCallback(async () => {
    const documentsInTrash = await db.documents
      .find()
      .where("isDeleted")
      .eq(true)
      .exec()

    const docIds = documentsInTrash.map((doc) => doc.id)

    console.log("documents to delete", documentsInTrash, docIds)

    const { error, success } = await db.documents.bulkRemove(docIds)

    error.forEach((doc) => {
      console.warn("failed to remove document", doc)
    })

    success.forEach((doc) => {
      console.log("removed document", doc)
      // check if document is open in a tab and close it
      let foundTabId = findTabWithDocumentId(tabsState, doc.id)
      if (foundTabId !== null) {
        closeTab(foundTabId)
      }
    })
  }, [closeTab, db.documents, tabsState])

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
        // TODO: this can fail if root group can't be found / created - handle this properly
        const newGroups = await createGroupsQuery(db).exec()

        const initialTabsState = await getLocalSetting("tabs")

        tabsDispatch({ type: "set-state", newState: initialTabsState })

        const newCurrentDocId = getCurrentCloudDocumentId(initialTabsState)

        if (newCurrentDocId !== null) {
          fetchDocument(newCurrentDocId)
        }

        // if (newCurrentDocId === null) {
        //   const document = await createDocument(null, undefined, {
        //     switchToDocument: false,
        //     switchToGroup: false,
        //   })
        //   setCurrentDocument(document)
        //   setIsDocumentLoading(false)
        //   tabsDispatch({
        //     type: "create-tab",
        //     documentId: document.id,
        //     switch: true,
        //   })
        // } else {
        //   const docId =
        //     initialTabsState.tabs[initialTabsState.currentTab].documentId
        //   await fetchDocument(docId)
        // }

        setIsInitialLoad(false)
        setGroups(newGroups)
      })()
    }
  }, [createDocument, db, fetchDocument, getLocalSetting, isInitialLoad])

  useEffect(() => {
    console.log("currentDocumentId changed, refetching document")
    fetchDocument(currentDocumentId)
  }, [currentDocumentId, fetchDocument])

  //#region sorting

  // State of the sorting options for the documents list
  // TODO: persist this locally
  // TODO: make this a per-collection setting
  // TODO: make sorting not take uppercase/lowercase into consideration (probably by having a separate 'slugTitle' field)
  const [sorting, setSorting] = useState<Sorting>({
    index: "titleSlug",
    direction: "asc",
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
        createDocument({ parentGroup: null })
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
      // unsyncedDocs,
      updateCurrentDocument,
      changeSorting,
      openDocument,
      closeTab, // TODO: find a better place to expose this
      tabsDispatch,
    }),
    [
      currentDocumentId,
      currentDocument,
      isDocumentLoading,
      groups,
      sorting,
      // unsyncedDocs,
      updateCurrentDocument,
      changeSorting,
      openDocument,
      closeTab,
      tabsDispatch,
    ]
  )
  const documentsAPI = useMemo(
    () => ({
      toggleDocumentFavorite,
      createDocument,
      removeDocument,
      permanentlyRemoveDocument,
      actuallyPermanentlyRemoveDocument,
      actuallyPermanentlyRemoveAllDocuments,
      permanentlyRemoveAllDocuments,
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
      actuallyPermanentlyRemoveDocument,
      actuallyPermanentlyRemoveAllDocuments,
      permanentlyRemoveAllDocuments,
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
  const tagsAPI = useMemo(
    () => ({ createTag, renameTag, actuallyPermanentlyDeleteTag }),
    [actuallyPermanentlyDeleteTag, createTag, renameTag]
  )

  return (
    <MainStateContext.Provider value={mainState}>
      <DocumentsAPIContext.Provider value={documentsAPI}>
        <GroupsAPIContext.Provider value={groupsAPI}>
          <TagsAPIContext.Provider value={tagsAPI}>
            <TabsStateContext.Provider value={tabsState}>
              <TabsDispatchContext.Provider value={tabsDispatch}>
                <ConfirmDeleteModal component={ConfirmDeleteModalContent} />
                {isInitialLoad ? <AppLoadingState /> : children}
              </TabsDispatchContext.Provider>
            </TabsStateContext.Provider>
          </TagsAPIContext.Provider>
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
  useTagsAPI,
  useMainState,
}

export * from "./types"
