import React from "react"
import styled from "styled-components/macro"

import { ANIMATION_FADEIN, ellipsis } from "../../style-utils"

import { useDocumentsAPI } from "../MainProvider"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import Icon from "../Icon"
import { usePrimarySidebar } from "../ViewState"

export const SectionHeader: React.FC<{
  groupId?: string | null
  onToggle: () => void
  isOpen: boolean
}> = ({ groupId, onToggle, isOpen, children }) => {
  const { switchSubview } = usePrimarySidebar()
  const { createDocument } = useDocumentsAPI()

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()

  const handleNewDocument = () => {
    if (groupId !== undefined) {
      createDocument(groupId)
    }
    closeMenu()
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (groupId === undefined) return
    openMenu(e)
  }

  const handleClick = () => {
    if (typeof groupId === "string") {
      switchSubview("cloud", "group", groupId)
    }
  }

  const handleToggleClick = () => {
    onToggle()
  }

  return (
    <>
      <SectionHeaderContainer isOpen={isOpen}>
        <div
          className="SectionHeader_Name"
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          title="Go to collection"
        >
          {children}
        </div>
        <div
          className="SectionHeader_Toggle"
          onClick={handleToggleClick}
          title={`${isOpen ? "Collapse" : "Expand"} collection`}
        >
          <Icon icon="chevronDown" />
        </div>
      </SectionHeaderContainer>

      <ContextMenu>
        <ContextMenuItem onClick={handleNewDocument}>
          New Document
        </ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default SectionHeader

const SectionHeaderContainer = styled.div<{ isOpen: boolean }>`
  --padding-x: 12px;
  --padding-y: 12px;

  font: bold 10px Poppins;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  display: flex;
  user-select: none;
  color: ${(p) => (p.isOpen ? `var(--light-300)` : `var(--light-100)`)};

  .SectionHeader_Name {
    padding: var(--padding-y);
    padding-left: var(--padding-x);

    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    ${ellipsis}

    &:hover {
      color: ${(p) => (p.isOpen ? `var(--light-400)` : `var(--light-300)`)};
      cursor: pointer;
    }
  }

  .SectionHeader_Toggle {
    padding: var(--padding-y);
    padding-right: calc(var(--padding-x) - 3px);

    display: none;
    cursor: pointer;
    white-space: nowrap;
    padding-left: 6px;

    > :first-child {
      margin-right: 3px;
    }

    animation: 200ms ease-out both ${ANIMATION_FADEIN};

    ${(p) => p.isOpen && `transform: rotate(180deg);`}

    :hover {
      color: ${(p) => (p.isOpen ? `var(--light-400)` : `var(--light-300)`)};
    }
  }

  :hover .SectionHeader_Toggle {
    display: flex;
  }
`
