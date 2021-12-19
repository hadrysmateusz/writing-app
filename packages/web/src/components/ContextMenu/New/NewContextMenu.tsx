import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react"
import { Portal } from "react-portal"

import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { ToggleableHooks, useToggleable } from "../../../hooks"

import { MenuContainer } from "../Common"

import { Coords } from "./types"
import { INITIAL_COORDS } from "./constants"
import { adjustMenuCoords } from "./helpers"
import { ContextMenuContext } from "./ContextMenuInternalContext"

type ContextMenuHookOptions = ToggleableHooks & {
  renderWhenClosed?: boolean
  toggleOnNestedDOMNodes?: boolean
  stopPropagation?: boolean
}

// TODO: unify how context menus are opened, because some are opened on mousedown and some on click, which leads to very different behaviors, especially when opening a menu with another already open
// TODO: capture focus inside the context menu and restore it when it closes

export const useContextMenu = (options: ContextMenuHookOptions = {}) => {
  const {
    toggleOnNestedDOMNodes = true,
    stopPropagation = true,
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
    }
  }, [close, eventCoords, isOpen])

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

type ContextMenuProps = {
  eventCoords: Coords
  close: () => void
  isOpen: boolean

  closeAfterClick?: boolean
  closeOnScroll?: boolean
}
export const ContextMenu: React.FC<ContextMenuProps> = memo(
  ({
    children,
    eventCoords,
    isOpen,
    closeAfterClick = true,
    closeOnScroll = true,
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
      const handler = () => {
        // the isOpen check might be important to properly registering and removing the listener (or at least the isOpen dependency)
        if (isOpen && closeOnScroll) {
          close()
        }
      }
      document.addEventListener("wheel", handler)
      return () => document.removeEventListener("wheel", handler)
    }, [close, closeOnScroll, isOpen])

    const adjust = useCallback(() => {
      setState((prevState) => {
        const menuEl = containerRef?.current

        if (!menuEl) {
          return prevState
        }

        if (prevState.isAdjusted) {
          return prevState
        }

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

    console.log("----------- render MENU -----------")
    console.log("internal coords:", state.coords)
    console.log("event coords:   ", eventCoords)
    console.log("state", state)

    return (
      <Portal>
        <ContextMenuContext.Provider
          value={{ parentMenuContainerRef: containerRef }}
        >
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
