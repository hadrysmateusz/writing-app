import React, { useCallback } from "react"
import styled from "styled-components/macro"
import { ContextMenuItem, useContextMenu } from "../../ContextMenu"

import { useDocumentsAPI } from "../../MainProvider"

export const NewButton: React.FC<{ groupId: string | null }> = ({
  groupId = null,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleNew = useCallback(() => {
    createDocument(groupId)
  }, [createDocument, groupId])

  return <NewButtonSC onClick={handleNew}>+ Create New</NewButtonSC>
}

export const InnerContainer: React.FC<{
  /**
   * Used for creating new documents
   *
   * If you don't want to create new documents from this view, use undefined
   */
  groupId: string | null | undefined
}> = ({ groupId, children }) => {
  const { createDocument } = useDocumentsAPI()
  const { openMenu, ContextMenu } = useContextMenu({
    toggleOnNestedDOMNodes: false,
  })

  const handleNewDocument = useCallback(() => {
    if (groupId === undefined) {
      console.error("undefined groupId")
      return
    }
    createDocument(groupId)
  }, [createDocument, groupId])

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (groupId === undefined) return
      openMenu(event)
    },
    [groupId, openMenu]
  )

  return (
    <InnerContainerSC onContextMenu={handleContextMenu}>
      {children}

      <ContextMenu>
        <ContextMenuItem onClick={handleNewDocument}>
          New Document
        </ContextMenuItem>
      </ContextMenu>
    </InnerContainerSC>
  )
}

const InnerContainerSC = styled.div`
  overflow-y: auto;
`

export const Container = styled.div`
  min-height: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr min-content;
`

const NewButtonSC = styled.div`
  font-family: poppins;
  font-weight: 500;
  font-size: 13px;
  color: #e4e4e4;
  background: #1e1e1e;
  user-select: none;
  border-top: 1px solid #363636;
  width: 100%;
  padding: 12px 20px;
  display: block;
  cursor: pointer;
  :hover {
    color: white;
  }
`
