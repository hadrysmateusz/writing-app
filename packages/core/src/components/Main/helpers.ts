import { useCallback, useState } from "react"

// TODO: replace local storage with something more performant - e.g. a local preferences rxdb database
export const getDefaultSize = (key: string, fallback: number): number => {
  return parseInt(localStorage.getItem(key) || fallback.toString(), 10)
}
export const setDefaultSize = (key: string, size: number): void => {
  localStorage.setItem(key, size.toString())
}

export const useSplitPane = (storageKey: string) => {
  const [size, setSize] = useState<number>(() =>
    getDefaultSize(storageKey, 200)
  )
  // TODO: debounce
  const handleChange = useCallback(
    (s) => {
      setSize(s)
      setDefaultSize(storageKey, s)
    },
    [storageKey]
  )

  return { defaultSize: size, handleChange }
}
