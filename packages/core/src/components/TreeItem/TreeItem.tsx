import React from "react"
import styled, { css } from "styled-components/macro"
import Icon from "../Icon"
import { StaticTreeItemProps } from "./types"

export const TreeItem: React.FC<StaticTreeItemProps> = ({
  icon,
  depth = 0,
  children,
  disabled = false,
  isSpecial = false,
  onClick,
  onContextMenu,
  ...rest
}) => {
  return (
    <OuterContainer
      depth={depth}
      disabled={disabled}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...rest}
    >
      <MidContainer>
        {icon && (
          <IconContainer isSpecial={isSpecial}>
            <Icon icon={icon} />
          </IconContainer>
        )}
        <InnerContainer isSpecial={isSpecial}>{children}</InnerContainer>
      </MidContainer>
    </OuterContainer>
  )
}

const MidContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 20px); /* to respect right-side padding */
`

const OuterContainer = styled.div<{
  depth: number
  disabled?: boolean
  isSpecial?: boolean
}>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  width: 100%;
  user-select: none;
  color: ${(p) => (p.isSpecial ? "#f2f2f2" : "#f0f0f0")};

  ${(p) =>
    p.disabled
      ? `
          color: #aaa;
          cursor: default;
        `
      : `
          :hover {
            color: white;
            background: #222;
            cursor: pointer;
          }
        `}
`

const InnerContainer = styled.div<{ isSpecial: boolean }>`
  font-family: "Segoe UI"; /* TODO: create global font-stacks */
  font-size: 12px;
  font-weight: ${(p) => (p.isSpecial ? "bold" : "normal")};
  text-rendering: optimizeLegibility;
  letter-spacing: 0.02em;
  padding: 5px 0;
  min-width: 0;
  flex-shrink: 1;
`

const IconContainer = styled.div<{ isSpecial: boolean }>`
  margin-right: 8px;
  margin-bottom: -2px; /* to help align the icon with the text */
  color: ${(p) => (p.isSpecial ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`
