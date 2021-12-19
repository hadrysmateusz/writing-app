import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react"
import { BsCaretRightFill } from "react-icons/bs"
import { Portal } from "react-portal"

import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { ToggleableHooks, useIsHovered, useToggleable } from "../../../hooks"
import { createContext } from "../../../utils"

import {
  CaretContainer,
  ContextMenuItemContainer,
  MenuContainer,
  SubmenuContainer,
  SubmenuLabel,
} from "../Common"

type ContextMenuHookOptions = ToggleableHooks & {
  renderWhenClosed?: boolean
  toggleOnNestedDOMNodes?: boolean
  stopPropagation?: boolean
  closeAfterClick?: boolean
  closeOnScroll?: boolean
}

const INITIAL_COORDS: [number, number] = [0, 0]

// TODO: replace old context menu with this one

// TODO: unify how context menus are opened, because some are opened on mousedown and some on click, which leads to very different behaviors, especially when opening a menu with another already open
// TODO: prevent submenus from going-offscreen. Probably by positioning them with js like regular menus. Prevent the main menu from being closed when a submenu is open.
// TODO: use ellipsis to hide overflow without hiding submenus (possible solutions include: portals, wrapper component for the static text)
// TODO: capture focus inside the context menu and restore it when it closes

export const useContextMenu = (options: ContextMenuHookOptions = {}) => {
  const {
    toggleOnNestedDOMNodes = true,
    stopPropagation = true,
    closeAfterClick = true,
    closeOnScroll = true,
    ...toggleableHooks
  } = options

  const [eventCoords, setEventCoords] =
    useState<[number, number]>(INITIAL_COORDS)

  const { close, open, isOpen } = useToggleable(false, toggleableHooks)

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      if (!toggleOnNestedDOMNodes && event.target !== event.currentTarget) {
        return
      }

      if (stopPropagation) {
        event.stopPropagation()
      }

      setEventCoords([event.pageX, event.pageY])
      open()
    },
    [open, stopPropagation, toggleOnNestedDOMNodes]
  )

  const closeMenu = useCallback(() => {
    close()
    // Reset the coordinates
    setEventCoords(INITIAL_COORDS)
  }, [close])

  const getContextMenuProps = useCallback(() => {
    return {
      eventCoords,
      close,
      isOpen,
      closeAfterClick,
      closeOnScroll,
    }
  }, [close, closeAfterClick, closeOnScroll, eventCoords, isOpen])

  return useMemo(
    () => ({
      openMenu,
      closeMenu,
      isMenuOpen: isOpen,
      getContextMenuProps,
    }),
    [closeMenu, getContextMenuProps, isOpen, openMenu]
  )
}

const ADJUST_OFFSET_MARGIN = 6
type Coords = [number, number]
const adjustMenuCoords = (
  menuEl: HTMLElement,
  referenceCoords: Coords
): Coords => {
  const refX = referenceCoords[0]
  const refY = referenceCoords[1]

  let newX: number
  let newY: number

  const rect = menuEl.getBoundingClientRect()
  const menuWidth = Math.ceil(rect.width)
  const menuHeight = Math.ceil(rect.height)
  const rightMenuEdge = refX + menuWidth
  const bottomMenuEdge = refY + menuHeight
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  if (rightMenuEdge > windowWidth) {
    const overflowOffset = rightMenuEdge - windowWidth + ADJUST_OFFSET_MARGIN
    newX = refX - overflowOffset
  } else {
    newX = refX
  }

  if (bottomMenuEdge > windowHeight) {
    // console.log("adjusting newY", refY, menuHeight, refY - menuHeight)
    const overflowOffset = bottomMenuEdge - windowHeight + ADJUST_OFFSET_MARGIN
    newY = refY - overflowOffset
  } else {
    newY = refY
  }

  return [newX, newY]
}

const [ContextMenuContext, useContextMenuContext] =
  createContext<{ menuRef: React.MutableRefObject<HTMLDivElement | null> }>()

export const ContextMenu: React.FC<{
  eventCoords: Coords
  close: () => void
  isOpen: boolean
  closeAfterClick: boolean
  closeOnScroll: boolean
}> = memo(
  ({
    children,
    eventCoords,
    isOpen,
    closeAfterClick,
    closeOnScroll,
    close,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [state, setState] = useState<{
      coords: Coords
      isAdjusted: boolean
    }>(() => {
      console.log("context menu mount, setting initial state")
      return {
        coords: eventCoords,
        isAdjusted: false,
      }
    })

    useEffect(() => {
      console.log("event coords changed:", eventCoords)
      setState({ coords: eventCoords, isAdjusted: false })
    }, [eventCoords])

    useOnClickOutside(containerRef, () => {
      close()
    })

    useEffect(() => {
      if (closeOnScroll) {
        const listener = () => {
          close()
        }
        document.addEventListener("wheel", listener, { once: true })
        return () => document.removeEventListener("wheel", listener)
      } else {
        return undefined
      }
    }, [close, closeOnScroll])

    useEffect(() => {
      const handler = () => {
        // the isOpen check might be important to properly registering and removing the listener (or at least the isOpen dependency)
        if (isOpen) {
          close()
        }
      }
      document.addEventListener("wheel", handler)
      return () => document.removeEventListener("wheel", handler)
    }, [close, isOpen])

    const adjust = useCallback(() => {
      setState((prevState) => {
        const menuEl = containerRef?.current

        if (!menuEl) {
          console.log("--------------- element unavailable ---------------")
          return prevState
        }

        if (prevState.isAdjusted) {
          console.log("--------------- already adjusted ---------------")
          return prevState
        }

        console.log("--------------- adjusting ---------------")

        const newCoords = adjustMenuCoords(menuEl, prevState.coords)

        return { coords: newCoords, isAdjusted: true }
      })
    }, [])

    useEffect(() => {
      adjust()
    }, [adjust])

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        /* Stops click events inside the context menu from propagating down the DOM tree
        TODO: see if this can be done without using event.stopPropagation */
        event.stopPropagation()

        /* Close the menu after a click inside*/
        if (closeAfterClick) {
          close()
        }
      },
      [close, closeAfterClick]
    )

    console.log("----------- render CONTEXT -----------")
    console.log("internal coords:", state.coords)
    console.log("event coords:   ", eventCoords)
    console.log("state", state)

    return (
      <Portal>
        <ContextMenuContext.Provider value={{ menuRef: containerRef }}>
          <MenuContainer
            isAdjusted={state.isAdjusted}
            xPos={state.coords[0]}
            yPos={state.coords[1]}
            ref={containerRef}
            onClick={handleClick}
          >
            {children}
          </MenuContainer>
        </ContextMenuContext.Provider>
      </Portal>
    )
  }
)

export const ContextSubmenu: React.FC<{ text: string }> = memo(
  ({ text, children, ...rest }) => {
    const menuItemRef = useRef<HTMLDivElement>(null)

    const { close, open, isOpen } = useToggleable(false)

    const { getHoverContainerProps, isHovered } = useIsHovered()

    useEffect(() => {
      if (isHovered) {
        open()
      } else {
        close()
      }
    }, [close, isHovered, open])

    return (
      <ContextMenuItem
        menuItemRef={menuItemRef}
        {...rest}
        onClick={(e) => e.stopPropagation()}
        {...getHoverContainerProps()}
      >
        <SubmenuLabel>
          <div>{text}</div>
          <CaretContainer>
            <BsCaretRightFill />
          </CaretContainer>
        </SubmenuLabel>
        {isOpen ? (
          <ContextSubmenuMenu menuItemRef={menuItemRef}>
            {children}
          </ContextSubmenuMenu>
        ) : null}
      </ContextMenuItem>
    )
  }
)

const BORDER_WIDTH = 1

const ContextSubmenuMenu: React.FC<{
  // TODO: maybe replace this ref with coords passed as props (like the base menu gets from event)
  menuItemRef: React.RefObject<HTMLDivElement>
}> = ({ children, menuItemRef }) => {
  const { menuRef: parentMenuRef } = useContextMenuContext()

  const submenuContainerRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<{
    coords: Coords
    isAdjusted: boolean
  }>(() => {
    console.log("context submenu menu mount, setting initial state")

    // get dom elements
    const parentMenuEl = parentMenuRef?.current
    const menuItemEl = menuItemRef?.current

    // ensure dom elements exist
    if (!parentMenuEl || !menuItemEl) {
      console.log("--------------- some element not available ---------------")
      return { coords: INITIAL_COORDS, isAdjusted: false }
    }

    // get parent menu measurements
    const parentMenuRect = parentMenuEl?.getBoundingClientRect()
    const parentMenuWidth = Math.ceil(parentMenuRect.width)
    const parentMenuRightEdge = parentMenuRect.x + parentMenuWidth

    // get menu item measurements
    const menuItemRect = menuItemEl?.getBoundingClientRect()
    const menuItemTopEdge = menuItemRect.y

    // reference position (intented position without need for adjustments)
    const refX = parentMenuRightEdge
    const refY = menuItemTopEdge

    return {
      coords: [refX, refY],
      isAdjusted: false,
    }
  })

  const adjust = useCallback(() => {
    setState((prevState) => {
      if (prevState.isAdjusted) {
        console.log("--------------- already adjusted ---------------")
        return prevState
      }

      // get dom elements
      const parentMenuEl = parentMenuRef?.current
      const menuEl = submenuContainerRef?.current
      const menuItemEl = menuItemRef?.current

      // ensure dom elements exist
      if (!menuEl || !parentMenuEl || !menuItemEl) {
        console.log(
          "--------------- some element not available ---------------"
        )
        return prevState
      }

      console.log("--------------- adjusting ---------------")

      // window dimensions
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // get parent menu measurements
      const parentMenuRect = parentMenuEl?.getBoundingClientRect()
      const parentMenuWidth = Math.ceil(parentMenuRect.width)
      const parentMenuLeftEdge = parentMenuRect.x
      const parentMenuRightEdge = parentMenuRect.x + parentMenuWidth

      // get menu item measurements
      const menuItemRect = menuItemEl?.getBoundingClientRect()
      const menuItemTopEdge = menuItemRect.y

      // reference position (intented position without need for adjustments)
      const refX = parentMenuRightEdge
      const refY = menuItemTopEdge

      let newX: number
      let newY: number

      const rect = menuEl.getBoundingClientRect()
      const menuWidth = Math.ceil(rect.width)
      const menuHeight = Math.ceil(rect.height)
      const menuRightEdge = refX + menuWidth
      const menuBottomEdge = refY + menuHeight

      if (menuRightEdge > windowWidth) {
        newX = parentMenuLeftEdge - menuWidth + BORDER_WIDTH
      } else {
        newX = refX - BORDER_WIDTH
      }

      if (menuBottomEdge > windowHeight) {
        const overflowOffset =
          menuBottomEdge - windowHeight + ADJUST_OFFSET_MARGIN
        newY = refY - overflowOffset
      } else {
        newY = refY
      }

      const newCoords: [number, number] = [Math.ceil(newX), Math.ceil(newY)]

      return {
        coords: newCoords,
        isAdjusted: true,
      }
    })
  }, [menuItemRef, parentMenuRef])

  useEffect(() => {
    adjust()
  }, [adjust])

  console.log("----------- render SUBMENU -----------")
  console.log("internal coords:", state.coords)
  console.log("state", state)

  return (
    <Portal>
      <SubmenuContainer
        ref={submenuContainerRef}
        isAdjusted={state.isAdjusted}
        xPos={state.coords[0]}
        yPos={state.coords[1]}
      >
        <ContextMenuContext.Provider value={{ menuRef: submenuContainerRef }}>
          {children}
        </ContextMenuContext.Provider>
      </SubmenuContainer>
    </Portal>
  )
}

type ContextMenuItemProps = {
  text?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void
  menuItemRef?: React.RefObject<HTMLDivElement>
}
export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  text,
  disabled = false,
  onClick,
  onMouseDown,
  children,
  menuItemRef,
  ...rest
}) => {
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
      ref={menuItemRef}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      {text ?? children}
    </ContextMenuItemContainer>
  )
}
