import styled, { css } from "styled-components/macro"

import { customScrollbar } from "../../style-utils"

export const AutocompleteContainer = styled.div`
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
`

const emphasizedSuggestionItem = css`
  color: var(--light-600);
  background-color: var(--dark-500);
  cursor: pointer;
`

export const SuggestionItem = styled.li<{ isActive: boolean }>`
  border-radius: 3px;
  padding: 8px 10px;

  ${(p) => p.isActive && emphasizedSuggestionItem}
  :hover {
    ${emphasizedSuggestionItem}
  }
`
