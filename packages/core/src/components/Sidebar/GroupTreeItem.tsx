import React, { useMemo, useCallback, useState } from "react"

import ExpandableTreeItem from "../ExpandableTreeItem"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ContextMenu2"
import { useViewState } from "../View/ViewStateProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { formatOptional } from "../../utils"
import { useGroupsAPI } from "../Groups/GroupsContext"
import { useDocumentsAPI } from "../DocumentsAPI"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
}> = ({ group, depth }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { createDocument } = useDocumentsAPI()
  const { createGroup, renameGroup, removeGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const {
    startRenaming: startNamingNew,
    getProps: getNamingNewProps,
    stopRenaming,
  } = useEditableText("", (value: string) => {
    stopRenaming()
    setIsCreatingGroup(false)
    createGroup(group.id, { name: value })
  })

  const { startRenaming, getProps } = useEditableText(
    formatOptional(group.name, ""),
    (value: string) => {
      renameGroup(group.id, value)
    }
  )

  const handleNewGroup = (e) => {
    setIsCreatingGroup(true)
    startNamingNew()
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
        <EditableText
          key="NEW_GROUP"
          /* TODO: check if a unique key would be better here */ {...getNamingNewProps()}
        />
      )
    }

    return nodes
  }, [getNamingNewProps, group.children, isCreatingGroup])

  return (
    <>
      <ExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        onClick={handleClick}
        childNodes={childNodes}
      >
        <EditableText {...getProps()}>{groupName}</EditableText>
      </ExpandableTreeItem>
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
