import React, { useMemo } from "react"
import styled from "styled-components/macro"

import { useMainState } from "../MainProvider"
import { useDocumentsAPI } from "../MainProvider"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ContextMenu/Old"

import { formatOptional } from "../../utils"
import { getGroupName } from "../../helpers/getGroupName"

export const GroupDisplay: React.FC = () => {
  const { currentDocument, groups } = useMainState()
  const { moveDocumentToGroup } = useDocumentsAPI()
  const { openMenu, ContextMenu } = useContextMenu()

  // TODO: when you change the document's group using the context menu on this component, the group name doesn't get updated
  const groupName = useMemo(() => {
    const groupId = currentDocument?.parentGroup ?? null
    return getGroupName(groupId, groups)
  }, [currentDocument, groups])

  return (
    <>
      <GroupContainer onClick={openMenu}>
        {groupName ?? <InboxContainer>Inbox</InboxContainer>}
      </GroupContainer>

      <ContextMenu>
        <ContextMenuItem disabled>Move to</ContextMenuItem>
        <ContextMenuSeparator />
        {groupName !== null && (
          <>
            <ContextMenuItem
              onClick={() => {
                if (currentDocument === null) {
                  // TODO: handle new documents
                } else {
                  moveDocumentToGroup(currentDocument.id, null)
                }
              }}
            >
              Inbox
            </ContextMenuItem>
          </>
        )}

        {/* TODO: add active styles */}
        {groups.length > 0 ? (
          groups.map((group) => (
            <ContextMenuItem
              key={group.id}
              onClick={() => {
                if (currentDocument === null) {
                  // TODO: handle new documents
                } else {
                  moveDocumentToGroup(currentDocument.id, group.id)
                }
              }}
            >
              {formatOptional(group.name, "Unnamed Collection")}
            </ContextMenuItem>
          ))
        ) : (
          <ContextMenuItem disabled>No collections</ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            console.warn("TODO")
          }}
        >
          Create new
        </ContextMenuItem>

        {/* TODO: add an option to create new group and move it there (DO THE SAME IN THE GROUP TREE ITEM) */}
      </ContextMenu>
    </>
  )
}

const InboxContainer = styled.div`
  color: var(--light-300);
`

const GroupContainer = styled.div`
  margin-left: 16px;
  cursor: pointer;
`
