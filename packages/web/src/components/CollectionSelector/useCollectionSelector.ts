import { useCallback, useMemo, useRef } from "react"

import { useToggleable } from "../../hooks"

export const useCollectionSelector = ({
  initialState = true,
}: {
  initialState?: boolean
} = {}) => {
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null)

  const toggleable = useToggleable(initialState, {
    onAfterOpen: () => {
      console.dir("after open", autocompleteInputRef?.current)
      // setTimeout is important for this to work
      setTimeout(() => {
        autocompleteInputRef?.current?.focus()
      }, 0)
    },
  })

  const getCollectionSelectorPropsAndRef = useCallback(() => {
    return {
      inputRef: autocompleteInputRef,
      // ref: autocompleteInputRef,
      ...toggleable,
    }
  }, [toggleable])

  return useMemo(
    () => ({ getCollectionSelectorPropsAndRef, ...toggleable }),
    [getCollectionSelectorPropsAndRef, toggleable]
  )
}
