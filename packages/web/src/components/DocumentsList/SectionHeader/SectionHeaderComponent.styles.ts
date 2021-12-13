import styled, { css } from "styled-components/macro"

import { ANIMATION_FADEIN, ellipsis } from "../../../style-utils"

type SectionNameProps = {
  isClickable: boolean
  isOpen: boolean
}

export const SectionName = styled.div<SectionNameProps>`
  padding: var(--padding-y);
  padding-left: var(--padding-x);

  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;

  ${ellipsis};

  ${(p) =>
    p.isClickable
      ? css`
          transition: color 200ms ease;
          &:hover {
            color: ${p.isOpen ? `var(--light-400)` : `var(--light-400)`};
            cursor: pointer;
          }
        `
      : null};
`

type SectionHeaderContainerProps = { isOpen: boolean }

export const SectionHeaderContainer = styled.div<SectionHeaderContainerProps>`
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
    white-space: nowrap;
    cursor: pointer;

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
