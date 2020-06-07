import React from "react"
import styled from "styled-components/macro"
import Icon from "./Icon"

const TreeItem: React.FC<{
  icon?: string
  depth?: number
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
}> = ({ icon, depth = 0, children, onClick, onContextMenu, ...rest }) => {
  const isRoot = depth === 0

  return (
    <OuterContainer
      depth={depth}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...rest}
    >
      {icon && (
        <IconContainer isRoot={isRoot}>
          <Icon icon={icon} />
        </IconContainer>
      )}
      <InnerContainer isRoot={isRoot}>{children}</InnerContainer>
    </OuterContainer>
  )
}

const OuterContainer = styled.div<{ depth: number }>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  :hover {
    color: white;
    background: #181818;
  }
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;
`

const InnerContainer = styled.div<{ isRoot: boolean }>`
  font-family: "Segoe UI"; /* TODO: create global font-stacks */
  font-size: 12px;
  color: ${(p) => (p.isRoot ? "#f2f2f2" : "#f0f0f0")};
  font-weight: ${(p) => (p.isRoot ? "bold" : "normal")};
  text-rendering: optimizeLegibility;
  letter-spacing: 0.02em;
  padding: 5px 0;
`

const IconContainer = styled.div<{ isRoot: boolean }>`
  margin-right: 8px;
  margin-bottom: -4px; /* to help align the icon with the text */
  color: ${(p) => (p.isRoot ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`

export default TreeItem
