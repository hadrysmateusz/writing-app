import { useState } from "react"

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
}

export const useToggleable = (
  initialState: boolean,
  {
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
  }: ToggleableHooks = {}
) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = () => {
    onBeforeOpen && onBeforeOpen()
    setIsOpen(true)
    onAfterOpen && onAfterOpen()
  }

  const close = () => {
    onBeforeClose && onBeforeClose()
    setIsOpen(false)
    onAfterClose && onAfterClose()
  }

  const toggle = () => {
    // The abstraction functions are used to make sure any and all pre-hooks are fired
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  return { open, close, toggle, isOpen }
}
