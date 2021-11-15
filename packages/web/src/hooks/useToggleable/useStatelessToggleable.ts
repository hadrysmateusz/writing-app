import { useCallback } from "react"
import { ToggleableHooks } from "./types"

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
