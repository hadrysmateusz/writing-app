import React from "react"

import Icon from "../Icon"
import {
  SectionHeaderContainer,
  SectionName,
} from "./SectionHeaderComponent.styles"

export const SectionHeaderComponent: React.FC<{
  isOpen?: boolean
  titleTooltip?: string
  togglerTooltip?: string
  onToggle?: () => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({
  children,
  isOpen = true,
  titleTooltip,
  togglerTooltip,
  onToggle,
  onClick,
  onContextMenu,
}) => {
  const handleToggleClick = onToggle
    ? () => {
        onToggle()
      }
    : undefined

  return (
    <SectionHeaderContainer isOpen={isOpen}>
      <SectionName
        title={titleTooltip}
        isOpen={isOpen}
        isClickable={!!onClick}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        {children}
      </SectionName>
      {!!onToggle ? (
        <div
          className="SectionHeader_Toggle"
          onClick={handleToggleClick}
          title={togglerTooltip}
        >
          <Icon icon={isOpen ? "chevronUp" : "chevronDown"} />
        </div>
      ) : null}
    </SectionHeaderContainer>
  )
}

export default SectionHeaderComponent
