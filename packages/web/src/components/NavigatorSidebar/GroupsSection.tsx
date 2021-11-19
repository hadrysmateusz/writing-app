import React, { useMemo, useState, useCallback } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import { useMainState } from "../MainProvider"
import createGroupTree from "../../helpers/createGroupTree"
import { GenericTreeItem } from "../TreeItem"
import { GroupsList } from "../GroupsList"

export const GroupsSection: React.FC = () => {
  const { groups } = useMainState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  // const [expandedKeys, setExpandedKeys] = useState([])

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
  }, [])

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  return groupsTree ? (
    <SectionContainer>
      <SectionHeader>Collections</SectionHeader>

      <GroupsList
        group={groupsTree}
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
