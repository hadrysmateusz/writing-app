import React from "react"
import styled from "styled-components/macro"
import { StaticTreeItemProps } from "./types"
import { TreeItem_AddDocumentButton } from "./AddButton"
import { TreeItemIcon } from "./TreeItemIcon"

export const TreeItem: React.FC<StaticTreeItemProps> = ({
  icon,
  depth = 0,
  children,
  disabled = false,
  isSpecial = false,
  isActive = false,
  onClick,
  onContextMenu,
  ...rest
}) => {
  return (
    <OuterContainer
      depth={depth}
      disabled={disabled}
      isActive={isActive}
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...rest}
    >
      <MidContainer>
        <TreeItemIcon icon={icon} />
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

type OuterContainerProps = {
  depth: number
  disabled?: boolean
  isSpecial?: boolean
  isActive?: boolean
}

const OuterContainer = styled.div<OuterContainerProps>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  width: 100%;
  user-select: none;
  /* color: ${(p) => (p.isSpecial ? "#f2f2f2" : "#f0f0f0")}; */
  color: var(--light-600);

  &:hover .${TreeItem_AddDocumentButton} {
    display: flex;
  }



  ${(p) =>
    p.disabled
      ? `
      color: var(--light-300);
      cursor: default;
      `
      : `
      cursor: pointer;
      :hover {
        color: white;
        background: var(--dark-200);
      }
    `}
  
  ${(p) =>
    p.isActive &&
    `
    color: white;
    background: var(--dark-200);
    `}
`

const InnerContainer = styled.div<{ isSpecial: boolean }>`
  font-family: "Segoe UI"; /* TODO: create global font-stacks */
  font-size: 12px;
  line-height: 16px;
  font-weight: ${(p) => (p.isSpecial ? "bold" : "normal")};
  text-rendering: optimizeLegibility;
  letter-spacing: 0.02em;
  padding: 4px 0 6px;

  min-width: 0;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  /* > * {
    // TODO: this is intended to make text inside tree items use the ellipsis overflow method, but it needs work because it make the expandable tree carets invisible
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } */
`
