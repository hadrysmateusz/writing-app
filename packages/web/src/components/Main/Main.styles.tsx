import styled, { css } from "styled-components/macro"

export const Grid = styled.div`
  display: grid;
  min-width: 0;
  min-height: 0;
  height: 100%;
`

export const Gutter = styled.div<{
  isSidebarOpen: boolean
  isDragging: boolean
}>`
  height: 100%;

  transition: border-color 1s ease;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;
  width: 0;

  /* --active-border-color: var(--dark-500); */

  ${(p) =>
    p.isSidebarOpen &&
    css`
      width: 4px;
      margin: 0 -2px;
      cursor: col-resize;
      border-left: 2px solid;
      border-right: 2px solid;
      border-color: transparent;

      /* border-color: ${p.isDragging
        ? `var(--active-border-color)`
        : `rgba(0, 0, 0, 0)`}; */
      /* 
      :hover {
        border-color: var(--active-border-color);
      } */
    `}
`
