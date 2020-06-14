import React, { useMemo, useCallback } from "react"

import ExpandableTreeItem from "../ExpandableTreeItem"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import { useContextMenu, ContextMenuItem } from "../ContextMenu2"
import { useMainState } from "../MainStateProvider"
import { useViewState } from "../ViewStateProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { formatOptional } from "../../utils"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
}> = ({ group, depth }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { newGroup, renameGroup, newDocument } = useMainState()
  const { primarySidebar } = useViewState()

  const handleNewDocument = () => {
    newDocument(true, group.id)
  }

  const handleNewGroup = () => {
    newGroup(group.id)
  }

  const handleClick = () => {
    primarySidebar.switchView(group.id)
  }

  const groupName = useMemo(
    () => formatOptional(group.name, "Unnamed Collection"),
    [group.name]
  )

  const { startRenaming, getProps } = useEditableText(
    groupName,
    (value: string) => {
      renameGroup(group.id, value)
    }
  )

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  return (
    <>
      <ExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        onClick={handleClick}
        childNodes={group.children.map((subgroup) => (
          <GroupTreeItem key={subgroup.id} group={subgroup} />
        ))}
      >
        <EditableText {...getProps()}>{groupName}</EditableText>
      </ExpandableTreeItem>
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
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
