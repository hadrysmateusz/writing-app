import { useEffect } from "react"

export const useOnWindowKeyDown = (
  handleKeyDown: (event: KeyboardEvent) => any
) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
