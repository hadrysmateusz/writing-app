import React from "react"
import styled, { keyframes } from "styled-components/macro"
import Icon from "../Icon"
import { StaticTreeItemProps } from "./types"
import { UnstyledButton } from "../Button"
import { useDocumentsAPI } from "../MainProvider"

const fadein = keyframes`
from {
  opacity: 0;
}

to {
  opacity: 1;;
}
`

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

export const TreeItem_AddDocumentButton = "TreeItem_AddDocumentButton"

export const AddButton: React.FC<{ tooltip?: string; groupId: string }> = ({
  // TODO: create custom tooltips that better match the style of the app
  tooltip = "Add a document inside",
  groupId,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleClick = () => {
    createDocument(groupId)
  }

  return (
    <AddButtonComponent title={tooltip} onClick={handleClick}>
      <Icon icon="plus" />
    </AddButtonComponent>
  )
}

const AddButtonComponent = styled(UnstyledButton).attrs({
  className: "TreeItem_AddDocumentButton",
})`
  color: #707070;
  border: 1px solid #4d4d4d;
  border-radius: 3px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-bottom: -2px;
  margin-left: 3px;
  align-items: center;
  justify-content: center;
  display: none;

  transition: background 200ms ease;
  animation: 200ms ease-out both ${fadein};

  :hover {
    color: #838383;
    background: #343434;
  }
`

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
  isActive?: boolean
}>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  width: 100%;
  user-select: none;
  color: ${(p) => (p.isSpecial ? "#f2f2f2" : "#f0f0f0")};

  &:hover .${TreeItem_AddDocumentButton} {
    // opacity: 1;
    display: flex;
  }

  ${(p) =>
    p.isActive &&
    `
    color: white;
    background: #222;
    `}

  ${(p) =>
    p.disabled
      ? `
      color: #aaa;
      cursor: default;
      `
      : `
      cursor: pointer;
      :hover {
            color: white;
            background: #222;
          }
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
  flex-shrink: 1;
  width: 100%;
`

const IconContainer = styled.div<{ isSpecial: boolean }>`
  margin-right: 8px;
  margin-bottom: 1px; /* to help align the icon with the text */
  color: ${(p) => (p.isSpecial ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`
