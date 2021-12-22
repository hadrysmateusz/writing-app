import { useState, useCallback, useMemo } from "react"

import { ToggleableHooks, useToggleable } from "../../hooks"

import { ContextMenuProps, Coords } from "./types"
import { INITIAL_COORDS } from "./constants"

// TODO: unify how context menus are opened, because some are opened on mousedown and some on click, which leads to very different behaviors, especially when opening a menu with another already open

type ContextMenuHookOptions = ToggleableHooks & {
  renderWhenClosed?: boolean
  toggleOnNestedDOMNodes?: boolean
  stopPropagation?: boolean
}

export const useContextMenu = (options: ContextMenuHookOptions = {}) => {
  const {
    toggleOnNestedDOMNodes = true,
    stopPropagation = true,
    ...toggleableHooks
  } = options

  const [eventCoords, setEventCoords] = useState<Coords>(INITIAL_COORDS)

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

  const getContextMenuProps: () => ContextMenuProps = useCallback(() => {
    return {
      eventCoords,
      isOpen,
      close,
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
