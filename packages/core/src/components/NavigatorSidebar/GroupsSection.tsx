import React, { useMemo, useState, useCallback, useEffect } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import { useMainState } from "../MainProvider"
import createGroupTree, { GroupTreeBranch } from "../../helpers/createGroupTree"
import { TreeItem } from "../TreeItem"
import { GroupsList } from "../GroupsList"
import { useDatabase, GroupDoc } from "../Database"

export const GroupsSection: React.FC = () => {
  const { rootGroup } = useMainState()
  const db = useDatabase()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groups, setGroups] = useState<GroupDoc[]>([])

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
  }, [])

  useEffect(() => {
    if (rootGroup) {
      db.groups.findByIds(rootGroup.childGroups).then((docs) => {
        // console.log(rootGroup.childGroups)
        // console.log(docs)

        const groups = rootGroup.childGroups.map((groupId) => {
          const groupDoc = docs.get(groupId)
          if (!groupDoc) {
            throw Error("Can't find group")
          }
          return groupDoc
        })

        setGroups(groups.reverse())
      })
    }
  }, [db.groups, rootGroup])

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => {
    return rootGroup ? createGroupTree(rootGroup, groups) : null
  }, [groups, rootGroup])

  console.log(groupsTree)

  return rootGroup && groupsTree ? (
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
  ) : null
}
