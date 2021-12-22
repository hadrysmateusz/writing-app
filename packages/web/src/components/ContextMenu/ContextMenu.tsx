import {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
  useLayoutEffect,
} from "react"
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
      return {
        coords: eventCoords,
        isAdjusted: false,
      }
    })

    useLayoutEffect(() => {
      console.log("event coords changed:", eventCoords)
      setState({ coords: eventCoords, isAdjusted: false })
    }, [eventCoords])

    useLayoutEffect(() => {
      if (state.isAdjusted) {
        return
      }

      const menuEl = containerRef?.current

      console.log(menuEl)

      if (!menuEl) {
        return
      }

      const newCoords = adjustMenuCoords(menuEl, state.coords)

      setState({ coords: newCoords, isAdjusted: true })
    }, [state.coords, state.isAdjusted])

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

    // console.log("----------- render MENU -----------")
    // console.log("internal coords:", state.coords)
    // console.log("event coords:   ", eventCoords)
    // console.log("state", state)

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
