import React, { useMemo, useState, useCallback } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import { useMainState } from "../MainProvider"
import createGroupTree from "../../helpers/createGroupTree"
import { TreeItem } from "../TreeItem"
import { GroupsList } from "../GroupsList"

export const GroupsSection: React.FC = React.memo(() => {
  const { groups } = useMainState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
  }, [])

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  return (
    <SectionContainer>
      <SectionHeader>Collections</SectionHeader>

      <GroupsList
        group={groupsTree}
        depth={1}
        isCreatingGroup={isCreatingGroup}
        setIsCreatingGroup={setIsCreatingGroup}
      />

      <TreeItem icon="plus" onClick={handleNewGroup} depth={1}>
        Add Collection
      </TreeItem>
    </SectionContainer>
  )
})
