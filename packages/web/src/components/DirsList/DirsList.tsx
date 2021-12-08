import { useCallback } from "react"

import {
  GroupingItemListComponent,
  GroupingItemListComponentProps,
} from "../GroupingItemList/GroupingItemListComponent"
import { useLocalFS } from "../LocalFSProvider"

type DirsListProps = Pick<
  GroupingItemListComponentProps,
  | "setIsCreatingGroup"
  | "isCreatingGroup"
  | "childItems"
  | "depth"
  | "parentItemId"
>

export const DirsList: React.FC<DirsListProps> = ({
  setIsCreatingGroup,
  isCreatingGroup,
  childItems,
  depth,
}) => {
  const { createDir } = useLocalFS()

  const handleCreateNewDir = useCallback(
    (values: { name?: string; parentItemId?: string | null }) => {
      console.log("createItem (DIR)", values)
      const { parentItemId = null, name } = values
      // TODO: fix the generic typing (on GroupingItemListComponent, I think) to better fit local directory methods (and remove the ORs below when it's done)
      createDir(name || "Unnamed", parentItemId || undefined)
    },
    [createDir]
  )

  return (
    <GroupingItemListComponent
      view="local"
      parentItemId={null}
      childItems={childItems}
      depth={depth}
      isCreatingGroup={isCreatingGroup}
      setIsCreatingGroup={setIsCreatingGroup}
      createItem={handleCreateNewDir}
    />
  )
}
