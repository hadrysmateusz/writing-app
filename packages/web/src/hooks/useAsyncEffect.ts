import { useEffect } from "react"

// TODO: replace this with a proper hook that can handle canceling and cleanup
export const useAsyncEffect = (fn: any, deps?: any[]) => {
  useEffect(() => {
    fn()
  }, deps)
}
