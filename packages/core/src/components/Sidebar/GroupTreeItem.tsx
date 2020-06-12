import React from "react"
import { v4 as uuidv4 } from "uuid"

import { DocumentDoc, useDatabase } from "../Database"
import ExpandableTreeItem from "../ExpandableTreeItem"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import { useContextMenu, ContextMenuItem } from "../ContextMenu"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
  newDocument: (
    shouldSwitch: boolean,
    parentGroup: string | null
  ) => Promise<DocumentDoc | null>
}> = ({ group, depth, newDocument }) => {
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()
  // TODO: move the group creation logic up
  const db = useDatabase()

  const handleNewDocument = () => {
    newDocument(true, group.id)
  }

  const handleNewGroup = () => {
    // TODO: make it possible to actually name the group properly
    db.groups.insert({
      id: uuidv4(),
      name: Date.now() + "",
      parentGroup: null,
    })
  }

  return (
    <>
      <ExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        startExpanded
        childNodes={group.children.map((subgroup) => (
          <GroupTreeItem group={subgroup} newDocument={newDocument} />
        ))}
      >
        {group.name}
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
