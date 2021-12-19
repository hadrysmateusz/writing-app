import { ContextMenuItemContainer } from "./styles"

type ContextMenuItemProps = {
  text?: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void
  menuItemRef?: React.RefObject<HTMLDivElement>
}
export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  text,
  disabled = false,
  onClick,
  onMouseDown,
  children,
  menuItemRef,
  ...rest
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      // prevent clicks on disabled items from closing the context menu
      event.stopPropagation()
      return
    }
    if (!onClick) return
    return onClick(event)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault()
      // prevent clicks on disabled items from closing the context menu
      event.stopPropagation()
      return
    }
    if (!onMouseDown) return
    return onMouseDown(event)
  }

  return (
    <ContextMenuItemContainer
      ref={menuItemRef}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...rest}
    >
      {text ?? children}
    </ContextMenuItemContainer>
  )
}
