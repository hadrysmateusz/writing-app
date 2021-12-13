import React, { useMemo, useState, useCallback } from "react"

import { createGroupTree, GroupTreeBranch } from "../../../helpers"

import { useMainState } from "../../MainProvider"
import { GenericAddButton } from "../../TreeItem"
import { GroupsList } from "../../GroupsList"
import { ItemsBranch } from "../../GroupingItemList"

import { SectionHeader, SectionContainer } from "../Common"

const MSG_GROUPS_HEADER = "Collections"

export const createGroupingItemBranchFromGroupTreeBranch = (
  groupTreeBranch: GroupTreeBranch
): ItemsBranch => {
  return {
    itemId: groupTreeBranch.id,
    itemName: groupTreeBranch.name,
    parentItemId: groupTreeBranch.parentGroup,
    childItems: groupTreeBranch.children.map((childGroupBranch) =>
      createGroupingItemBranchFromGroupTreeBranch(childGroupBranch)
    ),
  }
}

export const GroupsSection: React.FC = () => {
  const { groups } = useMainState()

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
  }, [])

  // TODO: maybe remove the entire GroupTree structure in favor of the new generic system
  // map the flat groups list to a tree structure
  const [groupsTree, childItems] = useMemo(() => {
    const groupsTree = createGroupTree(groups)
    const childItems =
      createGroupingItemBranchFromGroupTreeBranch(groupsTree).childItems
    return [groupsTree, childItems]
  }, [groups])

  return groupsTree ? (
    <SectionContainer>
      <GroupsSectionHeader newGroup={handleNewGroup} />

      <GroupsList
        parentItemId={null}
        childItems={childItems}
        depth={1}
        isCreatingGroup={isCreatingGroup}
        setIsCreatingGroup={setIsCreatingGroup}
      />
    </SectionContainer>
  ) : null
}

const GroupsSectionHeader = ({ newGroup }: { newGroup: () => void }) => {
  const handleAddClick = () => {
    newGroup()
  }

  return (
    <SectionHeader>
      <div>{MSG_GROUPS_HEADER}</div>
      <GenericAddButton onAdd={handleAddClick} />
    </SectionHeader>
  )
}
