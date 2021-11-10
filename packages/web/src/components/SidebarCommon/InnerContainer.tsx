import React, { useCallback } from "react"
import styled from "styled-components/macro"
import { customScrollbar } from "../../style-utils"

import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import { useDocumentsAPI } from "../MainProvider"

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
  ${customScrollbar}
`
