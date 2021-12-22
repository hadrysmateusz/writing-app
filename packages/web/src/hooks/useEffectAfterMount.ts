import { useEffect, useRef } from "react"

/**
 * A useEffect variant that only runs once after mount
 *
 * Credit: Kent C. Dodds
 */
export function useEffectAfterMount(callback: () => void, dependencies: any[]) {
  const justMounted = useRef(true)
  useEffect(() => {
    if (!justMounted.current) {
      return callback()
    }
    justMounted.current = false

    // TODO: figure out if callback should be passed to dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
