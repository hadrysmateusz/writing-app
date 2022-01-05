import React, { useCallback, useEffect, useRef, useState } from "react"
import { useIsHovered } from "../../hooks"
import { scrollToShow } from "../../utils"
import { TextInput } from "../TextInput"

import { AutocompleteContainer, SuggestionItem } from "./Autocomplete.styles"

// TODO: maybe make this a generic to support any value types
// TODO: maybe add additional optional fields to control how the option should be displayed
export type Option = { value: string | null; label: string; disabled?: boolean }

// TODO: improve the disabled items system (perhaps by skipping over disabled items when using arrow keys (this will require handling many edge cases and probably a recursive/looping function to handle multiple disabled options in a row))
// TODO: support autocompletes without option to create (hide create prompt, make create function optional etc.)

export const Autocomplete: React.FC<{
  suggestions: Option[]
  submit: (option: Option) => void
  create?: (value: string) => void
  close: () => void
  /**
   * Force the placeholder to be a custom string instead of currently selected option
   */
  placeholder?: string
  /**
   * Prompt to display when there are no matching options for the provided query
   */
  createNewPrompt?: string
  /**
   * Prompt to display when a valid option is selected (if skipped or undefined the prompt at the bottom won't be rendered at all)
   */
  submitPrompt?: string
  focusOnHover?: boolean
  inputRef: React.MutableRefObject<HTMLInputElement | null>
}> = ({
  submit,
  create,
  close,
  suggestions,
  placeholder,
  createNewPrompt = "Press 'Enter' to create new",
  submitPrompt,
  inputRef,
  focusOnHover = true,
}) => {
  // TODO: extract suggestions related logic outside into a hook. The values can then be passed back into the Autocomplete component with a prop getter but are also accessible from the outside to e.g. display stats about current filteredSuggestions etc.
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")

  const suggestionsContainerRef = useRef<HTMLUListElement | null>(null)
  const currentlyActiveElementRef = useRef<HTMLLIElement | null>(null)

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

  const reset = useCallback(() => {
    setInputValue("")
    setFilteredSuggestions(suggestions)
    setActiveSuggestionIndex(0)
  }, [suggestions])

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

  const wrappedSubmit = useCallback(
    (option: Option) => {
      if (option.disabled === true) {
        return
      } else {
        reset()
        submit(option)
      }
    },
    [reset, submit]
  )

  const onSuggestionClick = (option: Option) => {
    wrappedSubmit(option)
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "Escape": {
          close()
          break
        }
        case "ArrowUp": {
          event.stopPropagation()
          event.preventDefault()
          setActiveSuggestionIndex((prev) => Math.max(0, (prev -= 1)))
          break
        }
        case "ArrowDown": {
          event.stopPropagation()
          event.preventDefault()
          setActiveSuggestionIndex((prev) =>
            Math.min(filteredSuggestions.length - 1, (prev += 1))
          )
          break
        }
        case "Enter": {
          event.stopPropagation()
          event.preventDefault()

          if (filteredSuggestions[activeSuggestionIndex]) {
            // submit selected option
            wrappedSubmit(filteredSuggestions[activeSuggestionIndex])
          } else {
            if (create) {
              // create and submit the new option (all handled by 'create')
              const __inputValue = inputValue
              reset()
              create(__inputValue)
            }
          }
          break
        }
      }
    },
    [
      activeSuggestionIndex,
      close,
      create,
      filteredSuggestions,
      inputValue,
      reset,
      wrappedSubmit,
    ]
  )

  const { getHoverContainerProps, isHovered } = useIsHovered()

  useEffect(() => {
    const inputRefCurrent = inputRef?.current

    if (focusOnHover && isHovered) {
      inputRefCurrent?.focus()
    }

    // if (focusOnHover && !isHovered) {
    //   inputRefCurrent?.blur()
    // }
  }, [focusOnHover, inputRef, isHovered])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    const suggestionsContainer = suggestionsContainerRef.current
    const currentlyActiveItem = currentlyActiveElementRef.current

    if (!currentlyActiveItem || !suggestionsContainer) {
      return
    }

    setTimeout(() => {
      scrollToShow(currentlyActiveItem, suggestionsContainer)
    }, 0)
  }, [activeSuggestionIndex])

  const isEmpty = !(filteredSuggestions.length > 0)
  const isDisabledItemActive =
    filteredSuggestions[activeSuggestionIndex]?.disabled === true

  // TODO: add a way to create new by clicking
  return (
    <AutocompleteContainer
      onClick={(e) => e.stopPropagation()}
      {...getHoverContainerProps()}
    >
      <TextInput
        ref={inputRef}
        type="text"
        onChange={onChange}
        value={inputValue}
        placeholder={
          placeholder || filteredSuggestions[activeSuggestionIndex]?.label
        }
      />

      <div style={{ height: "6px" }} />

      {!isEmpty ? (
        <ul
          className="Autocomplete_SuggestionsContainer"
          ref={suggestionsContainerRef}
        >
          {filteredSuggestions.map((suggestion, index) => {
            return (
              <SuggestionItem
                key={suggestion.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onSuggestionClick(suggestion)
                }}
                isActive={index === activeSuggestionIndex}
                isDisabled={suggestion.disabled === true}
                ref={
                  index === activeSuggestionIndex
                    ? currentlyActiveElementRef
                    : undefined
                }
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
            : create
            ? createNewPrompt
            : "No results matching query"}
        </div>
      )}
      {!isEmpty && submitPrompt ? (
        <div className="Autocomplete_ConfirmPrompt">
          {isDisabledItemActive
            ? "Can't select. This option is disabled"
            : submitPrompt}
        </div>
      ) : null}
    </AutocompleteContainer>
  )
}
