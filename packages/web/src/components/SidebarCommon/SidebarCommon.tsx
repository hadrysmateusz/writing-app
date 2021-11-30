import styled, { css } from "styled-components/macro"
import { customScrollbar } from "../../style-utils"

export const SidebarContainer = styled.div<{ collapsed: boolean }>`
  min-height: 0;
  height: 100%;
  max-height: 100%;
  position: relative;
  background: var(--dark-300);
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;

  ${(p) =>
    p.collapsed &&
    css`
      width: 0;
      min-width: 0;
    `}
`

// TODO: move these view containers to their respective folders

export const PrimarySidebarViewContainer = styled.div<{ noButton?: boolean }>`
  min-height: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: min-content 1fr min-content;

  /* This caused the scrollbar to not appear for no apparent benefit */
  /* Removes the space reserved by grid and grid-template-rows */
  /* ${(p) => p.noButton && "display:block;"} */
`

export const SecondarySidebarViewContainer = styled.div`
  padding-top: 5px;
  min-height: 0;
  height: 100%;
  width: 100%;

  overflow: auto;
  ${customScrollbar}
`

export const SidebarTabsContainer = styled.div`
  background: var(--bg-100);
  height: var(--tab-size);
  min-width: fit-content;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  justify-content: start;
`
