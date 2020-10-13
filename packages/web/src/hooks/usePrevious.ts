import { useEffect, useRef } from "react"

export const usePrevious = (value: any) => {
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value
  return ref.current
}
