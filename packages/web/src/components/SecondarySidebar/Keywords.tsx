import React, { forwardRef, useEffect, useRef, useState } from "react"
import styled, { css } from "styled-components/macro"

import {
  useOnClickOutside,
  useRxSubscription,
  useToggleable,
} from "../../hooks"

import { TagDoc, TagDocType, useDatabase } from "../Database"
import { useDocumentsAPI, useMainState, useTagsAPI } from "../MainProvider"
import { customScrollbar } from "../../style-utils"

type Option = { value: TagDocType["id"] | null; label: TagDocType["name"] }

const Keywords = () => {
  const db = useDatabase()
  const { currentDocumentId } = useMainState()
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
      console.log("updating matching tags list")
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

  return (
    <TagsContainer isPopupOpen={isOpen}>
      {isReady ? (
        <AddTagButton
          onClick={(e) => {
            toggle()
          }}
        >
          {tagsOnDoc.length > 0 ? "+" : "+ Add tag"}
        </AddTagButton>
      ) : null}
      {currentDocument !== null
        ? tagsOnDoc.map((tag) => (
            <TagSmall key={tag.id} tagId={tag.id}>
              {tag.name}
            </TagSmall>
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

const Autocomplete = forwardRef<
  HTMLInputElement,
  {
    suggestions: Option[]
    submit: (value: Option) => void
  }
>(({ suggestions, submit }, inputRef) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    // Update filteredSuggestions to match new suggestions from parent
    setFilteredSuggestions(suggestions)
  }, [suggestions])

  useEffect(() => {
    // If change in filteredSuggestions would cause the current index to go out of bounds, we reset it to 0
    setActiveSuggestionIndex((prev) => {
      if (prev > filteredSuggestions.length - 1) {
        return 0
        // return Math.max(0, filteredSuggestions.length - 1)
      } else {
        return prev
      }
    })
  }, [filteredSuggestions])

  const reset = () => {
    setInputValue("")
    setFilteredSuggestions(suggestions)
    setActiveSuggestionIndex(0)
  }

  const onChange = (e) => {
    // Filter out suggestions that don't contain the user's input
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.label.toLowerCase().indexOf(e.target.value.toLowerCase()) >
        -1
    )

    setInputValue(e.target.value)
    setFilteredSuggestions(filtered)
    setActiveSuggestionIndex(0)
  }

  const onSuggestionClick = (option: Option) => {
    reset()
    submit(option)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // TODO: scroll when the selected item gets too low or too high
    switch (event.code) {
      case "ArrowUp": {
        event.preventDefault()
        console.log("ArrowUp")
        setActiveSuggestionIndex((prev) => Math.max(0, (prev -= 1)))
        break
      }
      case "ArrowDown": {
        event.preventDefault()
        console.log("ArrowDown")
        setActiveSuggestionIndex((prev) =>
          Math.min(filteredSuggestions.length - 1, (prev += 1))
        )
        break
      }
      case "Enter": {
        event.preventDefault()

        reset()

        if (filteredSuggestions[activeSuggestionIndex]) {
          // submit selected option
          submit(filteredSuggestions[activeSuggestionIndex])
        } else {
          // submit new option representing a tag to be created
          submit({ value: null, label: inputValue })
        }
        break
      }
    }
  }

  return (
    <AutocompleteContainer>
      <input
        ref={inputRef}
        type="text"
        onChange={onChange}
        onKeyDown={handleKeyDown} // TODO: use arrow keys to select options and enter/esc to select/close
        value={inputValue}
        placeholder={filteredSuggestions[activeSuggestionIndex]?.label}
      />

      {filteredSuggestions.length > 0 ? (
        <ul className="Autocomplete_SuggestionsContainer">
          {filteredSuggestions.map((suggestion, index) => {
            return (
              <SuggestionItem
                key={suggestion.value}
                onClick={() => onSuggestionClick(suggestion)}
                isActive={index === activeSuggestionIndex}
              >
                {suggestion.label}
              </SuggestionItem>
            )
          })}
        </ul>
      ) : (
        <div className="Autocomplete_EmptyState">
          {inputValue.trim() === ""
            ? "Start typing"
            : "Press 'Enter' to create new tag"}
        </div>
      )}
    </AutocompleteContainer>
  )
})

const AutocompleteContainer = styled.div``

const TagSmall: React.FC<{ tagId: string }> = ({ children, tagId }) => {
  const { updateDocument } = useDocumentsAPI()
  const { currentDocumentId } = useMainState()

  const removeTag = async (id: string) => {
    if (currentDocumentId !== null) {
      await updateDocument(currentDocumentId, (original) => ({
        tags: original.tags.filter((tagId) => tagId !== id),
      }))
    }
  }

  return (
    <TagSmallStyled
      title="Click to remove"
      onClick={async (e) => {
        removeTag(tagId)
      }}
    >
      {children}
    </TagSmallStyled>
  )
}

const AddTagButton = styled.div`
  cursor: pointer;

  padding: 3px 6px;
  border: 1px solid;

  font-size: 11px;

  color: var(--light-500);
  background-color: var(--dark-500);
  border-color: var(--dark-600);
  border-radius: 2px;

  :hover {
    color: var(--light-600);
    background-color: var(--dark-600);
    border-color: var(--dark-600);
  }
`

const emphasizedSuggestionItem = css`
  color: var(--light-600);
  background-color: var(--dark-500);
  cursor: pointer;
`

const SuggestionItem = styled.li<{ isActive: boolean }>`
  border-radius: 3px;
  padding: 8px 10px;

  ${(p) => p.isActive && emphasizedSuggestionItem}
  :hover {
    ${emphasizedSuggestionItem}
  }
`

const TagsContainer = styled.div<{ isPopupOpen: boolean }>`
  --tags-gap: 10px;

  margin: 4px 0;

  display: flex;
  flex-wrap: wrap;
  gap: var(--tags-gap);

  position: relative;

  .Tags_Popup {
    display: ${(p) => (p.isPopupOpen ? "block" : "none")};

    position: absolute;
    top: calc(100% + var(--tags-gap));

    background: var(--dark-400);
    border: 1px solid var(--dark-500);
    border-radius: 3px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    padding: 6px 6px;
    width: 100%;

    font-size: 12px;

    input {
      background: var(--dark-300);
      border: 1px solid var(--dark-500);
      color: white;

      padding: 4px 8px;

      width: 100%;
    }

    .Autocomplete_EmptyState {
      color: var(--light-100);
      padding-top: 10px;
    }
    .Autocomplete_SuggestionsContainer {
      color: var(--light-500);

      padding-top: 6px;
      border: none;
      list-style: none;
      margin: 0;
      max-height: 139px;
      overflow-y: auto;
      padding-left: 0;
      width: 100%;

      ${customScrollbar}
    }
  }
`

const TagSmallStyled = styled.div`
  cursor: pointer;
  user-select: none;

  padding: 3px 6px;
  border: 1px solid;

  font-size: 11px;

  color: var(--light-500);
  background-color: var(--dark-500);
  border-color: var(--dark-600);
  border-radius: 2px;

  :hover {
    color: var(--light-600);
    background-color: var(--dark-600);
    border-color: var(--dark-600);
  }
`

export default Keywords
