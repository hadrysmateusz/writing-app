import { useCallback, useEffect, useMemo, memo } from "react"
import { v4 as uuidv4 } from "uuid"
import isElectron from "is-electron"

import { createContext } from "../../utils"

import { parseSidebarPath, usePrimarySidebar } from "../ViewState"
import { useDatabase, DocumentDoc } from "../Database"
import { useModal } from "../Modal"
import { useTabsAPI } from "../TabsProvider"
import { serialize } from "../Editor/helpers"

import {
  CreateDocumentFn,
  RenameDocumentFn,
  MoveDocumentToGroupFn,
  ToggleDocumentFavoriteFn,
  RemoveDocumentFn,
  RestoreDocumentFn,
  FindDocumentByIdFn,
  UpdateDocumentFn,
  PermanentlyRemoveDocumentFn,
  DocumentsAPIContextType,
} from "./types"
import {
  ConfirmDeleteModalContent,
  ConfirmDeleteModalProps,
} from "./ConfirmDeleteModalContent"
import { DEFAULT_EDITOR_VALUE } from "./constants"

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query
// TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.
// TODO: rename to CloudDocumentsAPIContext
export const [DocumentsAPIContext, useDocumentsAPI] =
  createContext<DocumentsAPIContextType>()

export const DocumentsAPIProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()
  const primarySidebar = usePrimarySidebar()
  const { openDocument, closeTabByCloudDocumentId } = useTabsAPI()

  // The document deletion confirmation modal
  const {
    isOpen: isConfirmDeleteModalOpen,
    open: openConfirmDeleteModal,
    Modal: ConfirmDeleteModal,
  } = useModal<boolean, ConfirmDeleteModalProps>(false, {
    all: false,
    documentId: null,
  })

  /**
   * Finds a single document by id
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
    [db.documents, openDocument, primarySidebar]
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
      closeTabByCloudDocumentId(doc.id)
    })
  }, [closeTabByCloudDocumentId, db.documents])

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

  const documentsAPIContextValue: DocumentsAPIContextType = useMemo(
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
    }),
    [
      createDocument,
      findDocumentById,
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
  return (
    <DocumentsAPIContext.Provider value={documentsAPIContextValue}>
      {isConfirmDeleteModalOpen ? (
        <ConfirmDeleteModal component={ConfirmDeleteModalContent} />
      ) : null}

      {children}
    </DocumentsAPIContext.Provider>
  )
})
