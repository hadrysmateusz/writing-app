import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { useMainState } from "./MainProvider"
import { formatOptional } from "../utils"
import Icon from "./Icon"
import { useViewState } from "./View/ViewStateProvider"
import { useEditableText, EditableText } from "./RenamingInput"
import { useDocumentsAPI } from "./MainProvider"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./ContextMenu"
import { getGroupName } from "../helpers/getGroupName"
import { Button } from "./Button"

const SidebarToggler: React.FC = () => {
  const { primarySidebar, navigatorSidebar } = useViewState()
  return (
    <IconContainer
      onClick={() => {
        primarySidebar.toggle()
      }}
      onContextMenu={(e) => {
        // TODO: remove this if I ever implement the auto-hiding behavior and/or replace it with a context menu for controlling other view-related stuff
        e.preventDefault()
        navigatorSidebar.toggle()
      }}
    >
      <Icon icon="sidebarLeft" />
    </IconContainer>
  )
}

const DocumentTitle: React.FC<{}> = () => {
  const { renameDocument } = useDocumentsAPI()
  const { currentDocument } = useMainState()

  const { getProps: getEditableProps } = useEditableText(
    formatOptional(currentDocument?.title, ""),
    (value: string) => {
      if (currentDocument === null) return
      renameDocument(currentDocument.id, value)
    }
  )

  const title = formatOptional(currentDocument?.title, "Untitled")

  return (
    <TitleContainer>
      <EditableText {...getEditableProps()} disabled={currentDocument === null}>
        {title}
      </EditableText>
    </TitleContainer>
  )
}

const GroupDisplay: React.FC = () => {
  const { currentDocument, groups } = useMainState()
  const { moveDocumentToGroup } = useDocumentsAPI()
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()

  const parentGroupId = useMemo(() => {
    return currentDocument === null ? null : currentDocument.parentGroup
  }, [currentDocument])

  const groupName = useMemo(() => getGroupName(parentGroupId, groups), [
    parentGroupId,
    groups,
  ])

  return (
    <>
      <GroupContainer onClick={openMenu}>
        {groupName ?? <InboxContainer>Inbox</InboxContainer>}
      </GroupContainer>
      {isMenuOpen && (
        <ContextMenu>
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
      )}
    </>
  )
}

export const Topbar: React.FC<{}> = () => {
  return (
    <TopbarContainer>
      <SidebarToggler />

      <GroupDisplay />

      <SeparatorContainer>
        <Icon icon={"caretRight"} />
      </SeparatorContainer>

      <DocumentTitle />

      <RightSideContainer>
        <Button variant="default">Export</Button>
      </RightSideContainer>
    </TopbarContainer>
  )
}

const RightSideContainer = styled.div`
  margin-left: auto;
`

const IconContainer = styled.div`
  color: #6a6a6a;
  font-size: 18px;
  line-height: 18px;
  padding: 6px;
  margin: -6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;

  transition: all 100ms ease;

  &:hover {
    background-color: #353535;
    color: #b8b8b8;
  }

  &:active {
    background-color: #2a2a2a;
    color: #b8b8b8;
  }
`

const InboxContainer = styled.div`
  color: #a3a3a3;
`

const SeparatorContainer = styled.div`
  color: #545454;
  font-size: 10px;
  margin: 0 10px;
`

const GroupContainer = styled.div`
  margin-left: 16px;
  cursor: pointer;
`

const TitleContainer = styled.div`
  --width: 226px;

  letter-spacing: 0.01em;
  max-width: var(--width);

  .EditableText_editable {
    padding: 2px 2px 1px;
    width: var(--width);
  }
`

const TopbarContainer = styled.div`
  user-select: none;
  height: var(--topbar-height);
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid #363636;

  font-family: Poppins;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #e4e4e4;
`
