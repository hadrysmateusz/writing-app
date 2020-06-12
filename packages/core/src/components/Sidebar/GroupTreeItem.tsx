import React, { useMemo } from "react"

import ExpandableTreeItem from "../ExpandableTreeItem"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import { useContextMenu, ContextMenuItem } from "../ContextMenu"
import { useMainState } from "../MainStateProvider"
import { useViewState } from "../ViewStateProvider"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
}> = ({ group, depth }) => {
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { newGroup, newDocument } = useMainState()
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

  const groupName = useMemo(() => {
    return group.name.trim() === "" ? "Unnamed Collection" : group.name
  }, [group.name])

  return (
    <>
      <ExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        onClick={handleClick}
        startExpanded
        childNodes={group.children.map((subgroup) => (
          <GroupTreeItem group={subgroup} />
        ))}
      >
        {groupName}
      </ExpandableTreeItem>
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
    </>
  )
}

export default GroupTreeItem
