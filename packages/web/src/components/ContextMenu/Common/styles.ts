import styled, { css } from "styled-components/macro"

export const menuContainerCommon = css`
  background: var(--dark-400);
  border: 1px solid var(--dark-500);
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  min-width: 150px;
`

type MenuContainerProps = {
  xPos: number
  yPos: number
}
export const MenuContainer = styled.div<MenuContainerProps>`
  /* Base function styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  z-index: 3000;
  /* Visual styles */
  ${menuContainerCommon}
`

type ContextMenuItemContainerProps = { disabled?: boolean }
export const ContextMenuItemContainer = styled.div<ContextMenuItemContainerProps>`
  color: ${(p) => (p.disabled ? "var(--light-300)" : "white")};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};

  ${(p) => !p.disabled && `:hover { background: var(--dark-500); }`}

  position: relative;
  padding: 6px 20px;
  font-size: 12px;
`

export const SubmenuContainer = styled.div`
  /* Base styles */
  position: absolute;
  left: 100%;
  top: -7px; /* based on the padding of the the container and border width*/
  max-height: 322px;
  overflow-y: auto;
  /* Toggling logic */
  display: none;
  ${ContextMenuItemContainer}:hover & {
    display: block;
  }
  /* Visual styles */
  ${menuContainerCommon}
`

export const SubmenuLabel = styled.div`
  display: flex;
  align-items: center;
  & *:first-child {
    margin-right: auto;
  }
`

export const ContextMenuSeparator = styled.div`
  height: 1px;
  background: var(--dark-500);
  margin: 6px 0;
`

export const CaretContainer = styled.div`
  font-size: 0.77em;
  color: var(--light-400);
  margin-right: -5px;
  padding-top: 2px;
`
