import { useCallback, useState } from "react"

export function useIsHovered<ElementType = HTMLDivElement>() {
  // TODO: reduce duplication with subgroups
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = useCallback((_e: React.MouseEvent<ElementType>) => {
    setIsHovered(true)
  }, [])
  const handleMouseLeave = useCallback((_e: React.MouseEvent<ElementType>) => {
    setIsHovered(false)
  }, [])
  const getHoverContainerProps = useCallback(() => {
    return { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
  }, [handleMouseEnter, handleMouseLeave])
  return { isHovered, getHoverContainerProps }
}
