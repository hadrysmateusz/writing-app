import usePortal from "react-useportal"
import React, { useState } from "react"
import styled from "styled-components/macro"

export const useContextMenu = () => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal()
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const openMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setX(event.pageX)
    setY(event.pageY)
    openPortal(event)
  }

  /**
   * A component returned from the hook that will render the context menu inside a portal at the correct position
   */
  const ContextMenu: React.FC<{}> = ({ children }) => {
    return (
      <Portal>
        <MenuContainer xPos={x} yPos={y}>
          {children}
        </MenuContainer>
      </Portal>
    )
  }

  return { openMenu, closeMenu: closePortal, isMenuOpen: isOpen, ContextMenu }
}

const MenuContainer = styled.div<{ xPos: number; yPos: number }>`
  /* Base function styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  /* Visual styles */
  background: #41474d;
  border: 1px solid #1b1f23;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  padding: 4px 0;
  min-width: 120px;
`

export const ContextMenuItem = styled.div`
  padding: 6px 12px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  :hover {
    background: #4b5257;
  }
`
