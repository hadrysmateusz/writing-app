import { useCallback } from "react"

import {
  GroupingItemListComponent,
  GroupingItemListComponentProps,
} from "../GroupingItemList/GroupingItemListComponent"
import { useGroupsAPI } from "../MainProvider"

type GroupsListProps = Pick<
  GroupingItemListComponentProps,
  | "setIsCreatingGroup"
  | "isCreatingGroup"
  | "childItems"
  | "depth"
  | "parentItemId"
>

export const GroupsList: React.FC<GroupsListProps> = ({
  setIsCreatingGroup,
  isCreatingGroup,
  childItems,
  parentItemId,
  depth,
}) => {
  const { createGroup } = useGroupsAPI()

  const handleCreateNewGroup = useCallback(
    (values: { name?: string; parentItemId?: string | null }) => {
      console.log("createItem (GROUP)", values)
      const { parentItemId = null, name } = values
      createGroup(parentItemId, { name })
    },
    [createGroup]
  )

  return (
    <GroupingItemListComponent
      view="cloud"
      parentItemId={parentItemId}
      childItems={childItems}
      depth={depth}
      isCreatingGroup={isCreatingGroup}
      setIsCreatingGroup={setIsCreatingGroup}
      createItem={handleCreateNewGroup}
    />
  )
}
