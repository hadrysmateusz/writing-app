import { FC, useMemo } from "react"

import { GenericTreeItem } from "../TreeItem"
import { Ellipsis } from "../Ellipsis"
import { SidebarView } from "../ViewState"

import { ItemsBranch } from "./types"
import { GroupingItemTreeItem } from "./GroupingItemTreeItem"
import { NewGroupingItemInputTreeItem } from "./NewGroupingItemInputTreeItem"

export type GroupingItemListComponentProps = {
  view: SidebarView<"primary">
  parentItemId: string | null
  childItems: ItemsBranch[]
  depth: number
  isCreatingGroup: boolean
  setIsCreatingGroup: (newValue: boolean) => void
  createItem: (values: { name?: string; parentItemId?: string | null }) => void
}

export const GroupingItemListComponent: FC<GroupingItemListComponentProps> = ({
  view,
  parentItemId,
  childItems,
  depth,
  isCreatingGroup,
  setIsCreatingGroup,
  createItem,
}) => {
  const isEmpty = childItems.length === 0
  const isRoot = parentItemId === null

  return (
    <>
      {isEmpty && !isCreatingGroup ? (
        <GroupingItemListEmptyState depth={depth} isRoot={isRoot} view={view} />
      ) : (
        childItems.map((childItemBranch, index) => (
          <GroupingItemTreeItem
            key={childItemBranch.itemId}
            view={view}
            depth={depth}
            index={index}
            item={childItemBranch}
          />
        ))
      )}

      {/* FIXME: fix the input overflowing the sidebar */}
      {isCreatingGroup && (
        <NewGroupingItemInputTreeItem
          parentItemId={parentItemId}
          depth={depth}
          createItem={createItem}
          setIsCreatingGroup={setIsCreatingGroup}
          isCreatingGroup={isCreatingGroup}
        />
      )}
    </>
  )
}

type GroupingItemListEmptyStateProps = Pick<
  GroupingItemListComponentProps,
  "depth" | "view"
> & { isRoot: boolean }

const GroupingItemListEmptyState: FC<GroupingItemListEmptyStateProps> = ({
  depth,
  isRoot,
  view,
}) => {
  const emptyStateMessage = useMemo(() => {
    switch (view) {
      case "local":
        return isRoot ? "No Folders in Library" : "No Nested Folders"
      case "cloud":
        return isRoot ? "No Collections" : "No Nested Collections"
      default:
        console.error("wrong view type")
        return "Nothing's Here"
    }
  }, [isRoot, view])

  return (
    <GenericTreeItem depth={depth} disabled>
      <Ellipsis style={{ marginLeft: "2px" }}>{emptyStateMessage}</Ellipsis>
    </GenericTreeItem>
  )
}
