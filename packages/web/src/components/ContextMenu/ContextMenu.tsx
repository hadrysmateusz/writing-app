import { useState, useRef, useCallback, useEffect, useMemo, memo } from "react"
import { Portal } from "react-portal"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

import { ContextMenuProps, Coords } from "./types"
import { adjustMenuCoords } from "./helpers"
import { MenuContainer } from "./styles"
import { ContextMenuContext } from "./ContextMenuContext"

// TODO: capture focus inside the context menu and restore it when it closes
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
