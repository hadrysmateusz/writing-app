import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
  memo,
  useMemo,
} from "react"
import styled, { css } from "styled-components/macro"
import usePortal from "react-useportal"

import { useOnClickOutside } from "../hooks/useOnClickOutside"
import { BsCaretRightFill } from "react-icons/bs"
import { ToggleableHooks } from "../hooks"

type ContextMenuHookOptions = ToggleableHooks & {
  renderWhenClosed?: boolean
  toggleOnNestedDOMNodes?: boolean
  stopPropagation?: boolean
  closeAfterClick?: boolean
  closeOnScroll?: boolean
}

// TODO: replace this with the new context menu

// TODO: unify how context menus are opened, because some are opened on mousedown and some on click, which leads to very different behaviors, especially when opening a menu with another already open
// TODO: prevent submenus from going-offscreen. Probably by positioning them with js like regular menus. Prevent the main menu from being closed when a submenu is open.
// TODO: look into replacing some of the code and types with the useToggleable logic - probably will require removing the react-useportal dependency first to have full control over the portal state
// TODO: use ellipsis to hide overflow without hiding submenus (possible solutions include: portals, wrapper component for the static text)
export const useContextMenu = (options: ContextMenuHookOptions = {}) => {
  const {
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    renderWhenClosed = false,
    toggleOnNestedDOMNodes = true,
    stopPropagation = true,
    closeAfterClick = true,
    closeOnScroll = true,
  } = options

  // TODO: capture focus inside the context menu and restore it when it closes
  // TODO: maybe - replace the usePortal hook for more control (try using a single designated root DOM node instead of creating millions of empty divs)
  const { openPortal, closePortal, isOpen, Portal } = usePortal()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [eventX, setEventX] = useState(0)
  const [eventY, setEventY] = useState(0)

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      if (!toggleOnNestedDOMNodes && event.target !== event.currentTarget) {
        return
      }

      if (stopPropagation) {
        event.stopPropagation()
      }

      onBeforeOpen && onBeforeOpen()

      try {
        setEventX(event.pageX)
        setEventY(event.pageY)

        openPortal(event)
      } catch (error) {
        console.log(error)
        // TODO: better handle this - event can sometimes be undefined, which is probably caused by event reuse and might be solved in React 17.0
      }

      onAfterOpen && onAfterOpen()
    },
    [
      onAfterOpen,
      onBeforeOpen,
      openPortal,
      stopPropagation,
      toggleOnNestedDOMNodes,
    ]
  )

  const closeMenu = useCallback(() => {
    onBeforeClose && onBeforeClose()

    closePortal()

    // Reset the coordinates
    setEventX(0)
    setEventY(0)

    onAfterClose && onAfterClose()
  }, [closePortal, onAfterClose, onBeforeClose])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    /* Stops click events inside the context menu from propagating down the DOM tree 
    TODO: see if this can be done without using event.stopPropagation */
    event.stopPropagation()

    /* Close the menu after a click inside */
    if (closeAfterClick) {
      closeMenu()
    }
  }

  /**
   * A component returned from the hook that will render the context menu inside a portal at the correct position
   */
  const ContextMenu: React.FC<{}> = memo(({ children }) => {
    const [x, setX] = useState(eventX)
    const [y, setY] = useState(eventY)

    // useEffect(() => {
    //   console.log("mount")
    // }, [])

    useOnClickOutside(containerRef, () => {
      closeMenu()
    })

    useEffect(() => {
      if (closeOnScroll) {
        const listener = () => {
          closeMenu()
        }
        document.addEventListener("wheel", listener, { once: true })
        return () => document.removeEventListener("wheel", listener)
      } else {
        return undefined
      }
    }, [])

    useLayoutEffect(() => {
      if (x !== eventX || y !== eventY) {
        console.log("already adjusted")
        return
      }

      const menuEl = containerRef?.current

      if (!menuEl) {
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

    return isOpen || renderWhenClosed ? (
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
    ) : null
  })

  const withConditionalRender = useCallback(
    (C: React.FC): React.FC => {
      return isOpen || renderWhenClosed
        ? (props: React.PropsWithChildren<{}>) => <C {...props} />
        : (_props: React.PropsWithChildren<{}>) => null
    },
    [isOpen, renderWhenClosed]
  )

  const returnValue = useMemo(() => {
    return {
      openMenu,
      closeMenu,
      isMenuOpen: isOpen,
      ContextMenu: withConditionalRender(ContextMenu),
    }
  }, [ContextMenu, closeMenu, isOpen, openMenu, withConditionalRender])

  return returnValue
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
  text?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void
}> = ({ text, disabled = false, onClick, onMouseDown, children, ...rest }) => {
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
      {text ?? children}
    </ContextMenuItemContainer>
  )
}

const CaretContainer = styled.div`
  font-size: 0.77em;
  color: var(--light-400);
  margin-right: -5px;
  padding-top: 2px;
`

export const menuContainerCommon = css`
  background: var(--dark-400);
  border: 1px solid var(--dark-500);
  border-radius: 3px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  padding: 6px 0;
  min-width: 150px;
`

const MenuContainer = styled.div<{
  xPos: number
  yPos: number
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
  background: var(--dark-500);
  margin: 6px 0;
`

export const ContextMenuItemContainer = styled.div<{ disabled?: boolean }>`
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
