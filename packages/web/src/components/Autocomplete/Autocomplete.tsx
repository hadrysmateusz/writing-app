import React, { forwardRef, useEffect, useState } from "react"
import { TextInput } from "../TextInput"

import { AutocompleteContainer, SuggestionItem } from "./Autocomplete.styles"

export type Option = { value: string | null; label: string }

export const Autocomplete = forwardRef<
  HTMLInputElement,
  {
    suggestions: Option[]
    submit: (value: Option) => void
    /**
     * Force the placeholder to be a custom string instead of currently selected option
     */
    placeholder?: string
  }
>(({ suggestions, submit, placeholder }, inputRef) => {
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
      <TextInput
        ref={inputRef}
        type="text"
        onChange={onChange}
        onKeyDown={handleKeyDown} // TODO: use arrow keys to select options and enter/esc to select/close
        value={inputValue}
        placeholder={
          placeholder || filteredSuggestions[activeSuggestionIndex]?.label
        }
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
