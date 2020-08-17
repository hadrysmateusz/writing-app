import React, { useMemo } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import { useMainState, useGroupsAPI } from "../MainProvider"
import createGroupTree from "../../helpers/createGroupTree"
import { TreeItem } from "../TreeItem"
import { GroupsList } from "../GroupsList"

export const GroupsSection: React.FC = React.memo(() => {
  const { groups } = useMainState()
  const { createGroup } = useGroupsAPI()

  const handleNewGroup = () => {
    createGroup(null)
  }

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  return (
    <SectionContainer>
      <SectionHeader>Collections</SectionHeader>

      <GroupsList group={groupsTree} depth={1} />

      <TreeItem icon="plus" onClick={handleNewGroup} depth={1}>
        Add Collection
      </TreeItem>
    </SectionContainer>
  )
})
