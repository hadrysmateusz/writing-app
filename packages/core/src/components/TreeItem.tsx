import React from "react"
import styled from "styled-components/macro"
import Icon from "./Icon"

const TreeItem: React.FC<{
  icon?: string
  depth?: number
  /**
   * Means that the item should get special rendering to make it stand out
   * Replaces "isSpecial"
   */
  isSpecial?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
}> = ({
  icon,
  depth = 0,
  children,
  onClick,
  onContextMenu,
  isSpecial = false,
  ...rest
}) => {
  return (
    <OuterContainer
      depth={depth}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...rest}
    >
      {icon && (
        <IconContainer isSpecial={isSpecial}>
          <Icon icon={icon} />
        </IconContainer>
      )}
      <InnerContainer isSpecial={isSpecial}>{children}</InnerContainer>
    </OuterContainer>
  )
}

const OuterContainer = styled.div<{ depth: number }>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  width: 100%;
  :hover {
    color: white;
    background: #222;
  }
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;
`

const InnerContainer = styled.div<{ isSpecial: boolean }>`
  font-family: "Segoe UI"; /* TODO: create global font-stacks */
  width: 100%;
  font-size: 12px;
  color: ${(p) => (p.isSpecial ? "#f2f2f2" : "#f0f0f0")};
  font-weight: ${(p) => (p.isSpecial ? "bold" : "normal")};
  text-rendering: optimizeLegibility;
  letter-spacing: 0.02em;
  padding: 5px 0;
`

const IconContainer = styled.div<{ isSpecial: boolean }>`
  margin-right: 8px;
  margin-bottom: -4px; /* to help align the icon with the text */
  color: ${(p) => (p.isSpecial ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`

export default TreeItem
