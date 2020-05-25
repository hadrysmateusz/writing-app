import usePortal from "react-useportal"
import React, { useState, useRef, useCallback } from "react"
import styled from "styled-components/macro"
import { useOnClickOutside } from "../hooks/useOnClickOutside"

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

  useOnClickOutside(containerRef, () => {
    closeMenu()
  })

  /**
   * A component returned from the hook that will render the context menu inside a portal at the correct position
   */
  const ContextMenu: React.FC<{}> = ({ children }) => {
    return (
      <Portal>
        <MenuContainer xPos={x} yPos={y} ref={containerRef}>
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
  min-width: 160px;
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