import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"
import { scrollToShowElementFromRefs } from "../../helpers"
import { useIsHovered, useOnWindowKeyDown } from "../../hooks"
import { forceDependency } from "../../utils"

import { TextInput } from "../TextInput"
import {
  ActiveSuggestionIndexAction,
  activeSuggestionIndexReducer,
  DEFAULT_ACTIVE_SUGGESTION_INDEX,
} from "./activeSuggestionIndexSlice"

import { AutocompleteContainer } from "./Autocomplete.styles"
import { getSuggestionsMatchingQuery } from "./helpers"
import { SuggestionItem } from "./SuggestionItem"
import { Option } from "./types"

// TODO: improve the disabled items system (perhaps by skipping over disabled items when using arrow keys (this will require handling many edge cases and probably a recursive/looping function to handle multiple disabled options in a row))

const DEFAULT_INPUT_VALUE: string = ""

const useClampActiveSuggestionIndex = (
  suggestionsCount: number,
  dispatch: React.Dispatch<ActiveSuggestionIndexAction>
) => {
  useEffect(() => {
    // If change in filteredSuggestions would cause the current index to go out of bounds, we reset it to 0
    dispatch({
      type: "clamp",
      suggestionsCount: suggestionsCount,
    })
  }, [dispatch, suggestionsCount])
}

const useFilterSuggestions = (suggestions: Option[], query: string) => {
  return useMemo(
    () => getSuggestionsMatchingQuery(suggestions, query),
    [query, suggestions]
  )
}

export const Autocomplete: React.FC<{
  /**
   * List of all options passed from the parent
   */
  suggestions: Option[]
  /**
   * Method to handle selecting an existing option
   */
  submit: (option: Option) => void
  /**
   * Method to handle an option that doesn't exist
   * most likely by creating some new object using the value typed into the input field
   */
  create?: (value: string) => void
  /**
   * Close the popup
   */
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
  /**
   * Whether to focus the input field when the mouse moves into the popup
   */
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

  const suggestionsContainerRef = useRef<HTMLUListElement | null>(null)
  const currentlyActiveElementRef = useRef<HTMLLIElement | null>(null)

  const [inputValue, setInputValue] = useState(DEFAULT_INPUT_VALUE)

  const [activeSuggestionIndex, activeSuggestionIndexDispatch] = useReducer(
    activeSuggestionIndexReducer,
    DEFAULT_ACTIVE_SUGGESTION_INDEX
  )

  const filteredSuggestions = useFilterSuggestions(suggestions, inputValue)

  useClampActiveSuggestionIndex(
    filteredSuggestions.length,
    activeSuggestionIndexDispatch
  )

  const reset = useCallback(() => {
    setInputValue("")
    activeSuggestionIndexDispatch({ type: "reset" })
  }, [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    activeSuggestionIndexDispatch({ type: "reset" })
  }, [])

  /**
   * Submits if option isn't disabled and resets internal state
   *
   * @returns true if option was submitted, false if not
   */
  const wrappedSubmit = useCallback(
    (option: Option) => {
      if (option.disabled === true) {
        console.log("Can't submit, option is disabled")
        return false
      }
      reset()
      submit(option)
      return true
    },
    [reset, submit]
  )

  /**
   * Confirm the selection of an item. Generic wrapper to handle both submitting existing options and creating new ones
   */
  const confirmSelection = useCallback(() => {
    // We use Array.prototype.at instead of square brackets to make sure typescript knows this could potentailly be undefined
    const activeSuggestion = filteredSuggestions.at(activeSuggestionIndex)

    if (activeSuggestion) {
      // submit selected option
      wrappedSubmit(activeSuggestion)
    } else {
      if (create) {
        // create and submit the new option (all handled by 'create')
        const inputValueTemp = inputValue
        reset()
        create(inputValueTemp)
      }
    }
  }, [
    activeSuggestionIndex,
    filteredSuggestions,
    inputValue,
    create,
    reset,
    wrappedSubmit,
  ])

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
          activeSuggestionIndexDispatch({ type: "select-prev" })
          break
        }
        case "ArrowDown": {
          event.stopPropagation()
          event.preventDefault()
          activeSuggestionIndexDispatch({
            type: "select-next",
            suggestionsCount: filteredSuggestions.length,
          })
          break
        }
        case "Enter": {
          event.stopPropagation()
          event.preventDefault()
          confirmSelection()
          break
        }
      }
    },
    [close, confirmSelection, filteredSuggestions.length]
  )

  const { getHoverContainerProps, isHovered } = useIsHovered()

  useEffect(() => {
    const inputRefCurrent = inputRef?.current

    if (focusOnHover && isHovered) {
      inputRefCurrent?.focus()
    }
  }, [focusOnHover, inputRef, isHovered])

  useOnWindowKeyDown(handleKeyDown)

  useEffect(() => {
    // We want the scrollToShowElement function to re-run every time the activeSuggestionIndex changes for any reason, but the value itself isn't actually needed for the function to run, so we force a dependency to make sure it doesn't get removed by mistake
    forceDependency(activeSuggestionIndex)
    // Scroll to make the container currently active suggestion visible
    scrollToShowElementFromRefs(
      suggestionsContainerRef,
      currentlyActiveElementRef
    )
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
          placeholder ?? filteredSuggestions[activeSuggestionIndex]?.label
        }
      />

      <div style={{ height: "6px" }} />

      {!isEmpty ? (
        <ul
          className="Autocomplete_SuggestionsContainer"
          ref={suggestionsContainerRef}
        >
          {filteredSuggestions.map((suggestion, index) => {
            const isActive = index === activeSuggestionIndex
            return (
              <SuggestionItem
                key={suggestion.value}
                suggestion={suggestion}
                onSuggestionClick={wrappedSubmit}
                isActive={isActive}
                ref={isActive ? currentlyActiveElementRef : undefined}
              />
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
