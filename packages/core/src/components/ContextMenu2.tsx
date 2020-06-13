// This is a version WITH icons - it should be used wherever it doesn't cause issues

import React, { useState, useRef, useCallback } from "react"
import styled from "styled-components/macro"
import usePortal from "react-useportal"

import { useOnClickOutside } from "../hooks/useOnClickOutside"
import Icon from "./Icon"

export const useContextMenu = () => {
  // TODO: capture focus inside the context menu and restore it when it closes
  // TODO: maybe - replace the usePortal hook for more control (try using a single designated root DOM node instead of creating millions of empty divs)
  const { openPortal, closePortal, isOpen, Portal } = usePortal()
  const containerRef = useRef<any>()
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      // TODO: make sure the context menu doesn't go outside the window
      setX(event.pageX)
      setY(event.pageY)
      openPortal(event)
    },
    [openPortal]
  )

  const closeMenu = useCallback(() => {
    closePortal()
  }, [closePortal])

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
          <Icon icon="caretRight" />
        </CaretContainer>
      </SubmenuLabel>
      <SubmenuContainer>{children}</SubmenuContainer>
    </ContextMenuItem>
  )
}

const CaretContainer = styled.div`
  font-size: 0.77em;
  color: #c3c3c3;
  margin-right: -5px;
  padding-top: 2px;
`

const MenuContainer = styled.div<{ xPos: number; yPos: number }>`
  /* Base function styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  /* Visual styles */
  background: #383838;
  border: 1px solid #1b1f23;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  min-width: 160px;
`

export const ContextMenuSeparator = styled.div`
  height: 1px;
  background: #4b5257;
  margin: 6px 0;
`

export const ContextMenuItem = styled.div`
  position: relative;
  padding: 6px 20px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  :hover {
    background: #424242;
  }
`

export const SubmenuLabel = styled.div`
  display: flex;
  align-items: center;
  & *:first-child {
    margin-right: auto;
  }
`

// TODO: prevent the box shadow from overlaying the parent container
export const SubmenuContainer = styled.div`
  display: none;
  position: absolute;
  right: calc(-100% - 2px); /* -2px to account for borders */
  top: -7px; /* based on the padding of the the container and border width*/
  background-color: red;
  width: 100%;
  ${ContextMenuItem}:hover & {
    display: block;
  }
  /* reused styles from menu container - TODO: make this DRY */
  background: #383838;
  border: 1px solid #1b1f23;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  min-width: 160px;
`
