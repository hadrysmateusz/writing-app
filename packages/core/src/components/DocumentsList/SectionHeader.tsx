import React from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI } from "../MainProvider"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"

export const SectionHeader: React.FC<{ groupId?: string }> = ({
  groupId,
  children,
}) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()

  const { createDocument } = useDocumentsAPI()

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

  return (
    <>
      <SectionHeaderContainer onContextMenu={handleContextMenu}>
        {children}
      </SectionHeaderContainer>
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  )
}

const SectionHeaderContainer = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  user-select: none;

  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-bottom: 1px solid;
  border-color: #383838;
  color: #a3a3a3;
  background: #1c1c1c;
`
