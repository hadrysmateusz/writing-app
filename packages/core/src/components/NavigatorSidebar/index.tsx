import React, { useMemo } from "react"
import styled from "styled-components/macro"

// TODO: move common components out of the sidebar direcotory
import GroupTreeItem from "../Sidebar/GroupTreeItem"
import { VIEWS } from "../Sidebar/types"
import { TreeItem } from "../TreeItem"
import { useMainState } from "../MainState/MainStateProvider"
import { useContextMenu, ContextMenuItem } from "../ContextMenu2"
import { useViewState } from "../View/ViewStateProvider"

import createGroupTree from "../../helpers/createGroupTree"
import DocumentTreeItem from "../DocumentTreeItem"
import { useDocumentsAPI } from "../DocumentsAPI"
import { useGroupsAPI } from "../Groups/GroupsContext"

export const NavigatorSidebar: React.FC<{}> = () => {
  const { groups, favorites } = useMainState()
  const { createDocument } = useDocumentsAPI()
  const { createGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  const handleNewDocument = () => {
    createDocument(null)
  }

  const handleNewGroup = () => {
    createGroup(null)
  }

  return (
    <OuterContainer onContextMenu={openMenu}>
      <SectionHeader>Library</SectionHeader>

      <TreeItem
        icon="cloud"
        onClick={() => primarySidebar.switchView(VIEWS.ALL)}
        depth={1}
        isSpecial
      >
        All Documents
      </TreeItem>

      <TreeItem
        icon="trash"
        onClick={() => primarySidebar.switchView(VIEWS.TRASH)}
        depth={1}
        isSpecial
      >
        Trash
      </TreeItem>

      <SectionHeader>Favorites</SectionHeader>

      {favorites.map((document) => (
        <DocumentTreeItem key={document.id} depth={1} document={document} />
      ))}

      <SectionHeader>Collections</SectionHeader>

      {groupsTree.map((group) => (
        <GroupTreeItem key={group.id} group={group} depth={1} />
      ))}

      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
        </ContextMenu>
      )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  font-size: 12px;
  border-right: 1px solid;
  border-color: #383838;
  background-color: #171717;
  height: 100vh;
`

const SectionHeader = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  color: #a3a3a3;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 16px 20px 5px;

  user-select: none;
`
