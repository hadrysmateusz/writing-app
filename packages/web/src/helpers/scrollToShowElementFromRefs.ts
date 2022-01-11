import { scrollToShow } from "../utils"

export const scrollToShowElementFromRefs = (
  containerRef: React.MutableRefObject<HTMLElement | null>,
  targetRef: React.MutableRefObject<HTMLElement | null>
) => {
  const containerEl = containerRef.current
  const targetEl = targetRef.current

  if (!targetEl || !containerEl) {
    return
  }

  setTimeout(() => {
    scrollToShow(targetEl, containerEl)
  }, 0)
}
