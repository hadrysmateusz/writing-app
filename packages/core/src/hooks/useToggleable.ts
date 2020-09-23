import { useState, useCallback } from "react"

export interface Toggleable {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export interface SimplifiedToggleableHooks {
  onBeforeChange?: (newState: boolean) => void
  onAfterChange?: (newState: boolean) => void
}

export interface ToggleableHooks extends SimplifiedToggleableHooks {
  onBeforeOpen?: () => void
  onAfterOpen?: () => void
  onBeforeClose?: () => void
  onAfterClose?: () => void
}

// TODO: add a loading state - trigger it when running onBeforeOpen and open after it's done
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

/**
 * useToggleable that doesn't handle its own state, and only returns methods to change it + handles hooks
 */
export const useStatelessToggleable = (
  value: boolean,
  onChange: (newValue: boolean) => void,
  {
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    onBeforeChange,
    onAfterChange,
  }: ToggleableHooks = {}
) => {
  const open = useCallback(() => {
    onBeforeOpen && onBeforeOpen()
    onBeforeChange && onBeforeChange(true)

    onChange(true)

    onAfterChange && onAfterChange(true)
    onAfterOpen && onAfterOpen()
  }, [onAfterChange, onAfterOpen, onBeforeChange, onBeforeOpen, onChange])

  const close = useCallback(() => {
    onBeforeClose && onBeforeClose()
    onBeforeChange && onBeforeChange(false)

    onChange(false)

    onAfterChange && onAfterChange(false)
    onAfterClose && onAfterClose()
  }, [onAfterChange, onAfterClose, onBeforeChange, onBeforeClose, onChange])

  const toggle = useCallback(() => {
    // The abstraction functions are used to make sure that all pre & post hooks are fired
    if (value) {
      close()
    } else {
      open()
    }
  }, [close, value, open])

  return { open, close, toggle }
}
