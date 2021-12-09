import { useState, useCallback, useRef } from "react"
import { ToggleableHooks } from "./types"

// TODO: add a loading state - trigger it when running onBeforeOpen and open after it's done
export const useToggleable = <T = undefined>(
  initialState: boolean,
  {
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    onBeforeChange,
    onAfterChange,
  }: ToggleableHooks<T> = {}
) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const awaitCloseRef = useRef<{
    resolve: (value?: T) => void
  }>()

  const open = useCallback(async () => {
    onBeforeOpen && onBeforeOpen()
    onBeforeChange && onBeforeChange(true)

    setIsOpen(true)

    const awaitClosePromise = new Promise<T | undefined>((resolve, reject) => {
      awaitCloseRef.current = { resolve }
    })

    onAfterChange && onAfterChange(true)
    onAfterOpen && onAfterOpen()

    return awaitClosePromise
  }, [onAfterChange, onAfterOpen, onBeforeChange, onBeforeOpen])

  const close = useCallback(
    (resolveValue?: T) => {
      onBeforeClose && onBeforeClose()
      onBeforeChange && onBeforeChange(false)

      setIsOpen(false)

      awaitCloseRef.current?.resolve(resolveValue)
      awaitCloseRef.current = undefined

      onAfterChange && onAfterChange(false)
      onAfterClose && onAfterClose(resolveValue)
    },
    [onAfterChange, onAfterClose, onBeforeChange, onBeforeClose]
  )

  // // TODO: refactor this and make it safer to use
  // const closeWithoutResolving = useCallback(() => {
  //   onBeforeClose && onBeforeClose()
  //   onBeforeChange && onBeforeChange(false)

  //   setIsOpen(false)

  //   onAfterChange && onAfterChange(false)
  //   onAfterClose && onAfterClose()
  // }, [onAfterChange, onAfterClose, onBeforeChange, onBeforeClose])

  const toggle = useCallback(() => {
    // The abstraction functions are used to make sure that all pre & post hooks are fired
    if (isOpen) {
      return close()
    } else {
      return open()
    }
  }, [close, isOpen, open])

  return { open, close, toggle, isOpen }
}
