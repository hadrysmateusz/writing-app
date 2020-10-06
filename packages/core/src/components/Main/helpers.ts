import { useCallback, useMemo } from "react"

// TODO: replace local storage with something more performant - e.g. a local preferences rxdb database
export const getDefaultSize = (key: string, fallback: number): number => {
  return parseInt(localStorage.getItem(key) || fallback.toString(), 10)
}
export const setDefaultSize = (key: string, size: number): void => {
  localStorage.setItem(key, size.toString())
}

export const useSplitPane = (storageKey: string) => {
  const defaultSize = useMemo(() => getDefaultSize(storageKey, 200), [
    storageKey,
  ])
  const handleChange = useCallback((s) => setDefaultSize(storageKey, s), [
    storageKey,
  ])

  return { defaultSize, handleChange }
}
