import { useEffect } from "react"

// TODO: replace the fn type with a proper one
export const useAsyncEffect = (fn: any, deps?: any[]) => {
  useEffect(()=>{
    fn()
    // TODO: handle cleanup
  },deps)
}