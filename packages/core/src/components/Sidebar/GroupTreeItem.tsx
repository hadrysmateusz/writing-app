import React, { useMemo, useCallback, useState } from "react"
import styled from "styled-components/macro"

import { StatelessExpandableTreeItem } from "../TreeItem"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ContextMenu2"
import { useViewState } from "../View/ViewStateProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { useGroupsAPI } from "../Groups/GroupsContext"
import { useDocumentsAPI } from "../DocumentsAPI"

import { formatOptional } from "../../utils"
import { GroupTreeBranch } from "../../helpers/createGroupTree"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
}> = ({ group, depth }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { createDocument } = useDocumentsAPI()
  const { createGroup, renameGroup, removeGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    startRenaming: startNamingNew,
    getProps: getNamingNewProps,
    stopRenaming,
  } = useEditableText("", (value: string) => {
    stopRenaming()
    setIsCreatingGroup(false)
    if (value === "") return
    createGroup(group.id, { name: value })
  })

  const { startRenaming, getProps } = useEditableText(
    formatOptional(group.name, ""),
    (value: string) => {
      renameGroup(group.id, value)
    }
  )

  const handleNewGroup = (e: React.MouseEvent) => {
    setIsCreatingGroup(true)
    startNamingNew()
    setIsExpanded(true)
  }

  const handleNewDocument = () => {
    createDocument(group.id)
  }

  const handleDeleteGroup = () => {
    removeGroup(group.id)
  }

  const handleClick = () => {
    primarySidebar.switchView(group.id)
  }

  const groupName = useMemo(
    () => formatOptional(group.name, "Unnamed Collection"),
    [group.name]
  )

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const childNodes = useMemo(() => {
    const nodes = group.children.map((subgroup) => (
      <GroupTreeItem key={subgroup.id} group={subgroup} />
    ))

    if (isCreatingGroup) {
      nodes.unshift(
        <NewGroupContainer
          key="NEW_GROUP_INPUT"
          depth={typeof depth === "number" ? depth + 1 : 0}
        >
          <EditableText placeholder="Unnamed" {...getNamingNewProps()} />
        </NewGroupContainer>
      )
    }

    return nodes
  }, [getNamingNewProps, group.children, isCreatingGroup, depth])

  return (
    <>
      <StatelessExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        onClick={handleClick}
        childNodes={childNodes}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      >
        <EditableText {...getProps()}>{groupName}</EditableText>
      </StatelessExpandableTreeItem>
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          {/* TODO: add danger style option to ContextMenuItem */}
          <ContextMenuItem onClick={handleDeleteGroup}>Delete</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  )
}

export default GroupTreeItem

const NewGroupContainer = styled.div<{ depth: number }>`
  padding-left: ${(p) => (p.depth + 1) * 16}px;
  width: calc(100% - 20px);
  :hover {
    color: white;
    background: #222;
  }
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;

  .EditableText_editable {
    border: 1px solid #41474d;
    border-radius: 3px;
    padding: 3px 5px;
  }
`
