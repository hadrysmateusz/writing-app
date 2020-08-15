import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react"
import styled, { css } from "styled-components/macro"
import usePortal from "react-useportal"

import { useOnClickOutside } from "../hooks/useOnClickOutside"
import { BsCaretRightFill } from "react-icons/bs"
import { ToggleableHooks } from "../hooks"

// TODO: unify how context menus are opened, because some are opened on mousedown and some on click, which leads to very different behaviors, especially when opening a menu with another already open
// TODO: prevent submenus from going-offscreen. Probably by positioning them with js like regular menus. Prevent the main menu from being closed when a submenu is open.
// TODO: look into replacing some of the code and types with the useToggleable logic - probably will require removing the react-useportal dependency first to have full control over the portal state
// TODO: use ellipsis to hide overflow without hiding submenus (possible solutions include: portals, wrapper component for the static text)
export const useContextMenu = ({
  onBeforeOpen,
  onAfterOpen,
  onBeforeClose,
  onAfterClose,
}: ToggleableHooks = {}) => {
  // TODO: capture focus inside the context menu and restore it when it closes
  // TODO: maybe - replace the usePortal hook for more control (try using a single designated root DOM node instead of creating millions of empty divs)
  const { openPortal, closePortal, isOpen, Portal } = usePortal()
  const containerRef = useRef<HTMLDivElement>()
  const [eventX, setEventX] = useState(0)
  const [eventY, setEventY] = useState(0)

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      onBeforeOpen && onBeforeOpen()

      setEventX(event.pageX)
      setEventY(event.pageY)

      openPortal(event)

      onAfterOpen && onAfterOpen()
    },
    [onAfterOpen, onBeforeOpen, openPortal]
  )

  const closeMenu = () => {
    onBeforeClose && onBeforeClose()

    closePortal()

    // Reset the coordinates
    setEventX(0)
    setEventY(0)

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
   */
  const ContextMenu: React.FC<{}> = ({ children }) => {
    const [x, setX] = useState(eventX)
    const [y, setY] = useState(eventY)

    useOnClickOutside(containerRef, () => {
      closeMenu()
    })

    useEffect(() => {
      const listener = () => {
        closeMenu()
      }
      document.addEventListener("wheel", listener, { once: true })
      return () => document.removeEventListener("wheel", listener)
    }, [])

    useLayoutEffect(() => {
      if (x !== eventX || y !== eventY) {
        console.log("already adjusted")
        return
      }

      const menuEl = containerRef?.current

      if (menuEl === undefined) {
        console.log("element unavailable")
        return
      }

      const rect = menuEl.getBoundingClientRect()

      const menuWidth = Math.ceil(rect.width)
      const menuHeight = Math.ceil(rect.height)

      const rightMenuEdge = x + menuWidth
      const bottomMenuEdge = y + menuHeight

      if (bottomMenuEdge > window.innerHeight) {
        setY((y) => y - menuHeight)
      }

      if (rightMenuEdge > window.innerWidth) {
        setX((x) => x - menuWidth)
      }
    }, [x, y])

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
  background: #252525;
  border: 1px solid #363636;
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  min-width: 150px;
`

const MenuContainer = styled.div<{
  xPos: number
  yPos: number
  inverse: boolean
}>`
  /* Base function styles */
  position: absolute;
  top: ${(p) => p.yPos}px;
  left: ${(p) => p.xPos}px;
  z-index: 3000;
  /* Visual styles */
  ${menuContainerCommon}
`

export const ContextMenuSeparator = styled.div`
  height: 1px;
  background: #363636;
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
