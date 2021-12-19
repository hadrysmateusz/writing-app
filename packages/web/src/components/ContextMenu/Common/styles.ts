import styled, { css } from "styled-components/macro"

const MENU_CONTAINER_PADDING_Y = "6px"
const MENU_CONTAINER_BORDER_WIDTH = "1px"

export const menuContainerCommon = css`
  /* --menu-container-padding-y: 6px;
  --menu-container-border-width: 1px;

  min-width: 150px;
  padding: var(--menu-container-padding-y) 0;

  border-width: var(--menu-container-border-width);
  border-style: solid;
  border-color: var(--dark-500)
  border-radius: 3px;

  background: var(--dark-400);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); */

  min-width: 150px;
  padding: ${MENU_CONTAINER_PADDING_Y} 0;

  border-width: ${MENU_CONTAINER_BORDER_WIDTH};
  border-style: solid;
  border-color: var(--dark-500);
  border-radius: 3px;

  background: var(--dark-400);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
`

type MenuContainerProps = {
  isAdjusted: boolean
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
  ${menuContainerCommon};
  /* Visibility based on isAdjusted */
  opacity: ${(p) => (p.isAdjusted ? "1" : "0")};
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

// TODO: de-optionalize these props
type SubmenuContainerProps = {
  isAdjusted?: boolean
  xPos?: number
  yPos?: number
}
export const SubmenuContainer = styled.div<SubmenuContainerProps>`
  /* Base styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  z-index: 3000;

  /* Visibility based on isAdjusted */
  opacity: ${(p) => (p.isAdjusted ? "1" : "0")};

  /* Visual styles */
  ${menuContainerCommon}

  overflow: hidden;
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
