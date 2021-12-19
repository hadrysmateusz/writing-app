import { useState, useRef, useCallback, useEffect, memo } from "react"
import { Portal } from "react-portal"

import { useIsHovered, useToggleable } from "../../../hooks"

import Icon from "../../Icon"

import { CaretContainer, MenuContainer, SubmenuLabel } from "../Common"

import { Coords } from "./types"
import { INITIAL_COORDS } from "./constants"
import { adjustSubmenuCoords } from "./helpers"
import { ContextMenuItem } from "./ContextMenuItem"
import {
  ContextMenuContext,
  useContextMenuContext,
} from "./ContextMenuInternalContext"

type ContextSubmenuProps = { text: string }
export const ContextSubmenu: React.FC<ContextSubmenuProps> = memo(
  ({ text, children, ...rest }) => {
    const menuItemRef = useRef<HTMLDivElement | null>(null)

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
        onClick={(e) => e.stopPropagation()}
        {...getHoverContainerProps()}
        {...rest}
      >
        <SubmenuLabel>
          <div>{text}</div>
          <CaretContainer>
            <Icon icon="caretRight" />
          </CaretContainer>
        </SubmenuLabel>
        {isOpen ? (
          <ContextSubmenuMenu parentMenuItemRef={menuItemRef}>
            {children}
          </ContextSubmenuMenu>
        ) : null}
      </ContextMenuItem>
    )
  }
)

type ContextSubmenuMenuProps = {
  // TODO: maybe replace this ref with coords passed as props (like the base menu gets from event)
  parentMenuItemRef: React.MutableRefObject<HTMLDivElement | null>
}
const ContextSubmenuMenu: React.FC<ContextSubmenuMenuProps> = ({
  children,
  parentMenuItemRef,
}) => {
  const { parentMenuContainerRef } = useContextMenuContext()

  const submenuContainerRef = useRef<HTMLDivElement | null>(null)

  const [state, setState] = useState<{
    coords: Coords
    isAdjusted: boolean
  }>(() => {
    console.log("context submenu menu mount, setting initial state")

    // get dom elements
    const parentMenuEl = parentMenuContainerRef?.current
    const menuItemEl = parentMenuItemRef?.current

    // ensure dom elements exist
    if (!parentMenuEl || !menuItemEl) {
      console.log("------------- some element(s) not available -------------")
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
      const menuEl = submenuContainerRef?.current
      const parentMenuItemEl = parentMenuItemRef?.current
      const parentMenuEl = parentMenuContainerRef?.current

      if (prevState.isAdjusted) {
        return prevState
      }

      if (!menuEl || !parentMenuEl || !parentMenuItemEl) {
        return prevState
      }

      const newCoords = adjustSubmenuCoords(
        menuEl,
        parentMenuItemEl,
        parentMenuEl
      )

      return {
        coords: newCoords,
        isAdjusted: true,
      }
    })
  }, [parentMenuItemRef, parentMenuContainerRef])

  useEffect(() => {
    adjust()
  }, [adjust])

  console.log("----------- render SUBMENU -----------")
  console.log("internal coords:", state.coords)
  console.log("state", state)

  return (
    <Portal>
      <MenuContainer
        ref={submenuContainerRef}
        isAdjusted={state.isAdjusted}
        xPos={state.coords[0]}
        yPos={state.coords[1]}
      >
        <ContextMenuContext.Provider
          value={{ parentMenuContainerRef: submenuContainerRef }}
        >
          {children}
        </ContextMenuContext.Provider>
      </MenuContainer>
    </Portal>
  )
}
