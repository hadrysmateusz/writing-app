import styled, { css } from "styled-components/macro"

import { customScrollbar } from "../../style-utils"

export const AutocompleteContainer = styled.div`
  font-size: 12px;

  .Autocomplete_EmptyState {
    font-size: 11px;
    color: var(--light-100);
    padding: 4px 10px 4px;
  }
  .Autocomplete_SuggestionsContainer {
    color: var(--light-500);

    /* padding-top: 6px; */
    border: none;
    list-style: none;
    margin: 0;
    max-height: 165px;
    overflow-y: auto;
    padding-left: 0;
    width: 100%;
    display: block;

    ${customScrollbar}
  }
  .Autocomplete_ConfirmPrompt {
    font-size: 11px;
    border-top: 1px solid var(--dark-500);
    color: var(--light-100);
    padding: 10px 6px 4px 16px;
    margin: 6px -6px 0;
  }
`

const emphasizedSuggestionItem = (isDisabled: boolean) =>
  !isDisabled
    ? css`
        color: var(--light-600);
        background-color: var(--dark-500);
      `
    : css`
        background-color: #2c2c2c; // TODO: create more/better colors
      `

export const SuggestionItem = styled.li<{
  isActive: boolean
  isDisabled: boolean
}>`
  border-radius: 3px;
  padding: 8px 10px;
  user-select: none;
  cursor: pointer;

  scroll-padding-top: 20px;

  ${(p) =>
    p.isDisabled &&
    css`
      color: var(--light-300);
      cursor: default;
    `}

  ${(p) => p.isActive && emphasizedSuggestionItem(p.isDisabled)}

  ${(p) =>
    css`
      :hover {
        ${emphasizedSuggestionItem(p.isDisabled)};
        ${p.isDisabled &&
        !p.isActive &&
        css`
          background-color: transparent;
        `}
      }
    `}
`
