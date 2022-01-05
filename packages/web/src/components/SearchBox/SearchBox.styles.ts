import styled from "styled-components/macro"

import {
  IPositioned,
  menuContainerBaseStyles,
  menuContainerPositioning,
} from "../ContextMenu"

export const AutocompleteContainer = styled.div<IPositioned>`
  ${menuContainerBaseStyles}

  width: 280px;
  padding: 6px;

  ${menuContainerPositioning}
`

export const OuterContainer = styled.div`
  position: relative;
  padding: 0 16px 4px;
  margin-top: -4px;
`

// TODO: remove duplication
export const DummySearchBox = styled.div`
  cursor: text;

  background: var(--dark-200);
  color: var(--light-100);

  padding: 6px 10px;

  min-width: 0;

  width: 100%;

  font-family: inherit;
  font-size: inherit;

  border: 1px solid var(--dark-400);
  border-radius: 3px;

  display: flex;
  flex-direction: row;

  > :first-child {
    transform: scale(1.4);
    margin-right: 9px;
    margin-bottom: -2px;
  }
`
