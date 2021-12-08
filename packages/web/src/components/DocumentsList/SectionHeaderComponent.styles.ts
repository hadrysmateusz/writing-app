import styled, { css } from "styled-components/macro"

import { ANIMATION_FADEIN, ellipsis } from "../../style-utils"

export const SectionName = styled.div<{
  isClickable: boolean
  isOpen: boolean
}>`
  padding: var(--padding-y);
  padding-left: var(--padding-x);

  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  ${ellipsis}

  ${(p) =>
    p.isClickable
      ? css`
          transition: color 200ms ease;
          &:hover {
            color: ${p.isOpen ? `var(--light-400)` : `var(--light-400)`};
            cursor: pointer;
          }
        `
      : null}
`

export const SectionHeaderContainer = styled.div<{ isOpen: boolean }>`
  --padding-x: 12px;
  --padding-y: 12px;

  font: bold 10px Poppins;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  display: flex;
  user-select: none;

  transition: color 200ms ease;

  color: ${(p) => (p.isOpen ? `var(--light-300)` : `var(--light-100)`)};

  .SectionHeader_Toggle {
    padding: var(--padding-y);
    padding-right: calc(var(--padding-x) - 3px);
    padding-left: 6px;

    display: none;
    cursor: pointer;
    white-space: nowrap;

    > :first-child {
      margin-right: 3px;
    }

    animation: 200ms ease-out both ${ANIMATION_FADEIN};

    :hover {
      color: ${(p) => (p.isOpen ? `var(--light-400)` : `var(--light-400)`)};
    }
  }

  :hover .SectionHeader_Toggle {
    display: flex;
  }
`

// TODO: move to more appropriate spot
export const PrimarySidebarSectionContainer = styled.div<{
  isHovered: boolean
}>`
  border-radius: 4px;

  transition: background-color 200ms ease;

  ${(p) => (p.isHovered ? `background-color: #262626` : undefined)}
`
