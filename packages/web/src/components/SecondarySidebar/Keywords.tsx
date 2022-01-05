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
  const { currentCloudDocument } = useTabsState()
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

  const handleSubmit = async (option: Option) => {
    // close()

    if (currentCloudDocument !== null) {
      const oldTagIds = currentCloudDocument.tags
      const selectedTagId = option.value

      if (selectedTagId !== null) {
        if (oldTagIds.includes(selectedTagId)) return

        await updateDocument(currentCloudDocument.id, {
          tags: [...oldTagIds, selectedTagId],
        })

        return
      }

      return
    }
  }

  const handleCreate = async (value: string) => {
    const trimmedInputValue = value.trim()
    if (trimmedInputValue === "") return

    // The createTag function takes care of making sure the tag with this name doesn't exist already
    const newTag = await createTag({ name: trimmedInputValue })

    if (newTag === null) {
      // This tag already exists (something went wrong)
      return
    }

    handleSubmit({ value: newTag.id, label: trimmedInputValue })
  }

  useEffect(() => {
    if (tags === null) return
    if (currentCloudDocument === null) return

    setOptions(
      tags
        .map((tag) => ({ value: tag.id, label: tag.name }))
        .filter(
          (tagOption) => !currentCloudDocument.tags.includes(tagOption.value)
        )
    )
  }, [currentCloudDocument, tags])

  useEffect(() => {
    if (currentCloudDocument !== null && tags !== null) {
      const matchingTags: TagDoc[] = []
      currentCloudDocument.tags.forEach((tagId) => {
        const tag = tags.find((tag) => tag.id === tagId)
        if (tag) {
          matchingTags.push(tag)
        }
      })
      setTagsOnDoc(matchingTags)
    }
  }, [currentCloudDocument, tags])

  useOnClickOutside(containerRef, () => {
    // TODO: reset autocomplete inputValue on close
    if (isOpen) {
      close()
    }
  })

  const isReady = currentCloudDocument !== null && tags

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
      {currentCloudDocument !== null
        ? tagsOnDoc.map((tag) => (
            <Tag key={tag.id} tagId={tag.id}>
              {tag.name}
            </Tag>
          ))
        : null}
      <div className="Tags_Popup" ref={containerRef}>
        <Autocomplete
          inputRef={autocompleteInputRef}
          suggestions={options}
          submit={handleSubmit}
          close={close}
          create={handleCreate}
          submitPrompt="Press 'Enter' to confirm selection"
          createNewPrompt="Press 'Enter' to create new tag"
        />
      </div>
    </TagsContainer>
  )
}

export default Keywords
