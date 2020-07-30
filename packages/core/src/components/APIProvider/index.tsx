import React, { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import { useDatabase, GroupDoc, DocumentDoc } from "../Database"
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
} from "./types"
import { defaultEditorValue } from "../EditorStateProvider"
import { useViewState } from "../View"

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

export const APIProvider: React.FC = ({ children }) => {
  const db = useDatabase()
  const { primarySidebar } = useViewState()

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
    async (parentGroup: string | null) => {
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

      return newDocument
    },
    [db.documents]
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

  return (
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
  )
}

export * from "./types"
