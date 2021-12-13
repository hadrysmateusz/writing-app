import styled from "styled-components/macro"

export const PrimarySidebarSectionContainer = styled.div<{
  isHovered: boolean
}>`
  border-radius: 4px;

  transition: background-color 200ms ease;

  ${(p) => (p.isHovered ? `background-color: var(--dark-400)` : undefined)}
`
