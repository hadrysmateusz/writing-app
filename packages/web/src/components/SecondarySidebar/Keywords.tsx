import { useEffect, useRef, useState } from "react"

import {
  useOnClickOutside,
  useRxSubscription,
  useToggleable,
} from "../../hooks"

import { Autocomplete, Option } from "../Autocomplete"
import { TagDoc, useDatabase } from "../Database"
import { useDocumentsAPI } from "../CloudDocumentsProvider"
import { useTabsState } from "../TabsProvider"
import { Tag } from "../Tag"
import { useTagsAPI } from "../TagsProvider"

import { AddTagButton, TagsContainer } from "./Keywords.styles"

// TODO: rename this to Tags______
export const Keywords = () => {
  const db = useDatabase()
  const { currentDocumentId } = useTabsState()
  const { updateDocument } = useDocumentsAPI()
  const { createTag } = useTagsAPI()

  const [tagsOnDoc, setTagsOnDoc] = useState<TagDoc[]>([])
  const [options, setOptions] = useState<Option[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null)

  const { isOpen, toggle, close } = useToggleable(false, {
    onAfterOpen: () => {
      console.dir("after open", autocompleteInputRef?.current)
      // setTimeout is important for this to work
      setTimeout(() => {
        autocompleteInputRef?.current?.focus()
      }, 0)
    },
  })

  const { data: tags } = useRxSubscription(
    db.tags.find().sort({ nameSlug: "desc" })
  )

  const { data: currentDocument } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  const handleSubmit = async (option: Option) => {
    close()

    if (currentDocument !== null) {
      const oldTagIds = currentDocument.tags
      const selectedTagId = option.value

      if (selectedTagId !== null) {
        if (oldTagIds.includes(selectedTagId)) return

        await updateDocument(currentDocument.id, {
          tags: [...oldTagIds, selectedTagId],
        })

        return
      }

      const trimmedInputValue = option.label.trim()
      if (trimmedInputValue === "") return

      // The createTag function takes care of making sure the tag with this name doesn't exist already
      const newTag = await createTag({ name: trimmedInputValue })

      if (newTag === null) {
        // This tag already exists (something went wrong)
        return
      }

      await updateDocument(currentDocument.id, {
        tags: [...oldTagIds, newTag.id],
      })

      return
    }
  }

  useEffect(() => {
    if (tags === null) return
    if (currentDocument === null) return

    setOptions(
      tags
        .map((tag) => ({ value: tag.id, label: tag.name }))
        .filter((tagOption) => !currentDocument.tags.includes(tagOption.value))
    )
  }, [currentDocument, tags])

  useEffect(() => {
    if (currentDocument !== null && tags !== null) {
      const matchingTags: TagDoc[] = []
      currentDocument.tags.forEach((tagId) => {
        const tag = tags.find((tag) => tag.id === tagId)
        if (tag) {
          matchingTags.push(tag)
        }
      })
      setTagsOnDoc(matchingTags)
    }
  }, [currentDocument, tags])

  useOnClickOutside(containerRef, () => {
    // TODO: reset autocomplete inputValue on close
    if (isOpen) {
      close()
    }
  })

  const isReady = currentDocumentId !== null && tags

  const handleAddTagButtonClick = (_e) => {
    toggle()
  }

  return (
    <TagsContainer isPopupOpen={isOpen}>
      {isReady ? (
        <AddTagButton onClick={handleAddTagButtonClick}>
          {tagsOnDoc.length > 0 ? "+" : "+ Add tag"}
        </AddTagButton>
      ) : null}
      {currentDocument !== null
        ? tagsOnDoc.map((tag) => (
            <Tag key={tag.id} tagId={tag.id}>
              {tag.name}
            </Tag>
          ))
        : null}
      <div className="Tags_Popup" ref={containerRef}>
        <Autocomplete
          ref={autocompleteInputRef}
          suggestions={options}
          submit={handleSubmit}
        />
      </div>
    </TagsContainer>
  )
}

export default Keywords
