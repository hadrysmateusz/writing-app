import React, { useState, useRef, useCallback } from "react"
import styled, { css } from "styled-components/macro"
import usePortal from "react-useportal"

import { useOnClickOutside } from "../hooks/useOnClickOutside"
import { BsCaretRightFill } from "react-icons/bs"

// TODO: use ellipsis to hide overflow without hiding submenus (possible solutions include: portals, wrapper component for the static text)
export const useContextMenu = ({
  onBeforeOpen,
  onAfterOpen,
  onBeforeClose,
  onAfterClose,
}: {
  onBeforeOpen?: () => void
  onAfterOpen?: () => void
  onBeforeClose?: () => void
  onAfterClose?: () => void
} = {}) => {
  // TODO: capture focus inside the context menu and restore it when it closes
  // TODO: maybe - replace the usePortal hook for more control (try using a single designated root DOM node instead of creating millions of empty divs)
  const { openPortal, closePortal, isOpen, Portal } = usePortal()
  const containerRef = useRef<any>()
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      // TODO: make sure the context menu doesn't go outside the window
      onBeforeOpen && onBeforeOpen()

      setX(event.pageX)
      setY(event.pageY)
      openPortal(event)
      onAfterOpen && onAfterOpen()
    },
    [onAfterOpen, onBeforeOpen, openPortal]
  )

  const closeMenu = () => {
    onBeforeClose && onBeforeClose()
    closePortal()
    onAfterClose && onAfterClose()
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    /* Stops click events inside the context menu from propagating down the DOM tree 
    TODO: see if this can be done without using event.stopPropagation */
    event.stopPropagation()
    /* Close the menu after a click inside
    TODO: a way to not trigger this will probably be required for more complex menus*/
    closeMenu()
  }

  /**
   * A component returned from the hook that will render the context menu inside a portal at the correct position
   *
   * TODO: this component should take a prop that would set the value for react context that all contextmenuitem children should have access to
   */
  const ContextMenu: React.FC<{}> = ({ children }) => {
    useOnClickOutside(containerRef, () => {
      closeMenu()
    })
    return (
      <Portal>
        <MenuContainer
          xPos={x}
          yPos={y}
          ref={containerRef}
          onClick={handleClick}
        >
          {children}
        </MenuContainer>
      </Portal>
    )
  }

  return { openMenu, closeMenu, isMenuOpen: isOpen, ContextMenu }
}

export const ContextSubmenu: React.FC<{ text: string }> = ({
  text,
  children,
  ...rest
}) => {
  return (
    <ContextMenuItem {...rest}>
      <SubmenuLabel>
        <div>{text}</div>
        <CaretContainer>
          <BsCaretRightFill />
        </CaretContainer>
      </SubmenuLabel>
      <SubmenuContainer>{children}</SubmenuContainer>
    </ContextMenuItem>
  )
}

export const ContextMenuItem: React.FC<{
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void
}> = ({ disabled = false, onClick, onMouseDown, children, ...rest }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      // prevent clicks on disabled items from closing the context menu
      event.stopPropagation()
      return
    }
    if (!onClick) return
    return onClick(event)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      // prevent clicks on disabled items from closing the context menu
      event.stopPropagation()
      return
    }
    if (!onMouseDown) return
    return onMouseDown(event)
  }

  return (
    <ContextMenuItemContainer
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      {children}
    </ContextMenuItemContainer>
  )
}

const CaretContainer = styled.div`
  font-size: 0.77em;
  color: #c3c3c3;
  margin-right: -5px;
  padding-top: 2px;
`

const menuContainerCommon = css`
  background: #383838;
  border: 1px solid #1b1f23;
  border-radius: 3px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  width: 200px;
`

const MenuContainer = styled.div<{ xPos: number; yPos: number }>`
  /* Base function styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  /* Visual styles */
  ${menuContainerCommon}
`

export const ContextMenuSeparator = styled.div`
  height: 1px;
  background: #4b5257;
  margin: 6px 0;
`

export const ContextMenuItemContainer = styled.div<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? "#aaa" : "white")};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};

  ${(p) => !p.disabled && `:hover { background: #424242; }`}

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

export const SubmenuContainer = styled.div`
  /* Base styles */
  position: absolute;
  right: calc(-100% - 2px); /* -2px to account for borders */
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
