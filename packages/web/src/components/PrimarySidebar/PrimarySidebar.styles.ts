import styled, { keyframes } from "styled-components/macro"

export const ANIMATION_OPEN = keyframes`
  from {
    opacity: 0.45;
    /* transform: scaleY(0.4);
    transform-origin: 100% 0%; */
  }
  to {
    opacity: 1;
    /* transform: scaleY(1);
    transform-origin: 100% 0%; */
  }
`

export const PrimarySidebarToggleableSectionContainer = styled.div`
  animation: ${ANIMATION_OPEN} 250ms ease-out both;
`

export const PrimarySidebarSectionContainer = styled.div<{
  isHovered: boolean
}>`
  border-radius: 4px;

  transition: background-color 200ms ease-out;

  ${(p) => (p.isHovered ? `background-color: var(--dark-400)` : undefined)}
`
