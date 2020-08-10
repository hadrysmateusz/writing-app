import { useState, useCallback } from "react"

export interface Toggleable {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export interface ToggleableHooks {
  onBeforeOpen?: () => void
  onAfterOpen?: () => void
  onBeforeClose?: () => void
  onAfterClose?: () => void
  onBeforeChange?: (newState: boolean) => void
  onAfterChange?: (newState: boolean) => void
}

export const useToggleable = (
  initialState: boolean,
  {
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    onBeforeChange,
    onAfterChange,
  }: ToggleableHooks = {}
) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    onBeforeOpen && onBeforeOpen()
    onBeforeChange && onBeforeChange(true)

    setIsOpen(true)

    onAfterChange && onAfterChange(true)
    onAfterOpen && onAfterOpen()
  }, [onAfterChange, onAfterOpen, onBeforeChange, onBeforeOpen])

  const close = useCallback(() => {
    onBeforeClose && onBeforeClose()
    onBeforeChange && onBeforeChange(false)

    setIsOpen(false)

    onAfterChange && onAfterChange(false)
    onAfterClose && onAfterClose()
  }, [onAfterChange, onAfterClose, onBeforeChange, onBeforeClose])

  const toggle = useCallback(() => {
    // The abstraction functions are used to make sure that all pre & post hooks are fired
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [close, isOpen, open])

  return { open, close, toggle, isOpen }
}
