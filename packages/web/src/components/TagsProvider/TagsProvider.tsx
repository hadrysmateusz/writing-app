import { useCallback, useMemo, memo } from "react"
import { v4 as uuidv4 } from "uuid"

import { createContext } from "../../utils"

import { useDatabase } from "../Database"
import { getConfirmModalContent, useConfirmModal } from "../ConfirmModal"

import {
  ActuallyPermanentlyDeleteTagFn,
  RenameTagFn,
  CreateTagFn,
  TagsAPI,
} from "./types"

const ConfirmDeleteTagModalContent = getConfirmModalContent({
  confirmMessage: "Delete",
  promptMessage: "Are you sure you want to delete this tag?",
  secondaryPromptMessage: "This action can't be undone",
})

export const [TagsAPIContext, useTagsAPI] = createContext<TagsAPI>()

export const TagsProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()

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

  const {
    open: openConfirmDeleteTagModal,
    Modal: ConfirmDeleteTagModal,
    isOpen: isConfirmDeleteTagModalOpen,
  } = useConfirmModal()

  const actuallyPermanentlyDeleteTag: ActuallyPermanentlyDeleteTagFn =
    useCallback(
      async (id) => {
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
      },
      [db.tags]
    )

  const permanentlyDeleteTag = useCallback(
    async (tagId: string) => {
      const shouldDelete = await openConfirmDeleteTagModal({})
      if (shouldDelete) {
        return await actuallyPermanentlyDeleteTag(tagId)
      }
    },
    [actuallyPermanentlyDeleteTag, openConfirmDeleteTagModal]
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

  const tagsAPI = useMemo(
    () => ({
      createTag,
      renameTag,
      actuallyPermanentlyDeleteTag,
      permanentlyDeleteTag,
    }),
    [actuallyPermanentlyDeleteTag, createTag, renameTag, permanentlyDeleteTag]
  )

  return (
    <TagsAPIContext.Provider value={tagsAPI}>
      {isConfirmDeleteTagModalOpen ? (
        <ConfirmDeleteTagModal component={ConfirmDeleteTagModalContent} />
      ) : null}
      {children}
    </TagsAPIContext.Provider>
  )
})
