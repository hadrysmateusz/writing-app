import React, { useMemo, useState, useCallback } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import { useMainState } from "../MainProvider"
import { createGroupTree, GroupTreeBranch } from "../../helpers"
import { GenericTreeItem } from "../TreeItem"
import { GroupingItemList, ItemsBranch } from "../GroupsList"

const createGroupingItemBranch = (
  groupTreeBranch: GroupTreeBranch
): ItemsBranch => {
  return {
    itemId: groupTreeBranch.id,
    itemName: groupTreeBranch.name,
    parentItemId: groupTreeBranch.parentGroup,
    childItems: groupTreeBranch.children.map((childGroupBranch) =>
      createGroupingItemBranch(childGroupBranch)
    ),
  }
}

export const GroupsSection: React.FC = () => {
  const { groups } = useMainState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  // const [expandedKeys, setExpandedKeys] = useState([])

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
  }, [])

  // TODO: maybe remove the entire GroupTree structure in favor of the new generic system
  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  const childItems = useMemo(
    () => createGroupingItemBranch(groupsTree).childItems,
    [groupsTree]
  )

  return groupsTree ? (
    <SectionContainer>
      <SectionHeader>Collections</SectionHeader>

      <GroupingItemList
        view="cloud"
        itemId={groupsTree.id}
        childItems={childItems}
        depth={1}
        isCreatingGroup={isCreatingGroup}
        setIsCreatingGroup={setIsCreatingGroup}
      />

      {!isCreatingGroup ? (
        <GenericTreeItem icon="plus" onClick={handleNewGroup} depth={0}>
          Add Collection
        </GenericTreeItem>
      ) : null}
    </SectionContainer>
  ) : null
}
