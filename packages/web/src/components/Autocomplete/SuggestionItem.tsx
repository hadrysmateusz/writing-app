import { forwardRef, useCallback } from "react"

import { SuggestionItemStyledNode } from "./Autocomplete.styles"
import { Option } from "./types"

type SuggestionItemProps = {
  suggestion: Option
  isActive: boolean
  onSuggestionClick: (suggestion: Option) => void
}
export const SuggestionItem = forwardRef<
  HTMLLIElement | null,
  SuggestionItemProps
>(({ suggestion, isActive, onSuggestionClick }, ref) => {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      onSuggestionClick(suggestion)
    },
    [onSuggestionClick, suggestion]
  )

  return (
    <SuggestionItemStyledNode
      key={suggestion.value}
      onClick={handleClick}
      isActive={isActive}
      isDisabled={suggestion.disabled === true}
      ref={ref}
    >
      {suggestion.label}
    </SuggestionItemStyledNode>
  )
})
