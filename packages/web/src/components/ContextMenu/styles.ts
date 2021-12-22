import styled, { css, keyframes } from "styled-components/macro"

export const MENU_CONTAINER_PADDING_Y_VALUE = 6
const MENU_CONTAINER_PADDING_Y = MENU_CONTAINER_PADDING_Y_VALUE + "px"

export const MENU_CONTAINER_BORDER_WIDTH_VALUE = 1
const MENU_CONTAINER_BORDER_WIDTH = MENU_CONTAINER_BORDER_WIDTH_VALUE + "px"

interface IPositioned {
  xPos: number
  yPos: number
}
interface IAdjustable {
  isAdjusted: boolean
}

// The scale 1 opacity 0 at first is to prevent the scale transform from changing the element's dimensions before they're read by the adjustment logic

export const ANIMATION_OPEN = keyframes`
  0% {
    opacity: 0;
    transform: scale(1);
    transform-origin: 0% 0%;
  }
  1% {
    opacity: 0;
    transform: scale(0.4);
    transform-origin: 0% 0%;
  }

  2% {
    opacity: 0.55;
    transform: scale(0.4);
    transform-origin: 0% 0%;
  }
  80% {
    transform: scale(1.025);
    transform-origin: 0% 0%;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    transform-origin: 0% 0%;
  }
`

export const menuContainerBaseStyles = css`
  min-width: 150px;
  padding: ${MENU_CONTAINER_PADDING_Y} 0;

  border-width: ${MENU_CONTAINER_BORDER_WIDTH};
  border-style: solid;
  border-color: var(--dark-500);
  border-radius: 3px;

  background: var(--dark-400);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

  animation: ${ANIMATION_OPEN} 90ms ease-out both;

  /* overflow: hidden; */
`

const menuContainerPositioning = (p: IPositioned) => css`
  position: absolute;
  top: ${p.yPos}px;
  left: ${p.xPos}px;
  z-index: 3000;
`

const opacityFromIsAdjusted = (p: IAdjustable) =>
  css`
    opacity: ${p.isAdjusted ? "1" : "0"};
  `

type MenuContainerProps = {
  isAdjusted: boolean
  xPos: number
  yPos: number
}
export const MenuContainer = styled.div<MenuContainerProps>`
  /* Visual styles */
  ${menuContainerBaseStyles};

  /* Positioning */
  ${menuContainerPositioning};

  /* Visibility based on isAdjusted */
  ${opacityFromIsAdjusted};
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

export const ContextMeta = styled.div`
  font-weight: 500;
  padding: 6px 20px;
  font-size: 11px;
  color: var(--light-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
`
