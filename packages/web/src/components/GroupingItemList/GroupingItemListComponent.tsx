import { FC, useEffect, useMemo } from "react"

import { GenericTreeItem } from "../TreeItem"
import { Ellipsis } from "../Ellipsis"
import { useEditableText, EditableText } from "../RenamingInput"
import { SidebarView } from "../ViewState"

import { ItemsBranch } from "./types"
import { GroupingItemTreeItem } from "./GroupingItemTreeItem"

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

      {/* TODO: fix the input overflowing the sidebar */}
      {isCreatingGroup && (
        <NewGroupInputTreeItem
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

type NewGroupInputTreeItemProps = Pick<
  GroupingItemListComponentProps,
  | "depth"
  | "setIsCreatingGroup"
  | "isCreatingGroup"
  | "createItem"
  | "parentItemId"
>

const NewGroupInputTreeItem: FC<NewGroupInputTreeItemProps> = ({
  depth,
  setIsCreatingGroup,
  isCreatingGroup,
  createItem,
  parentItemId,
}) => {
  const {
    startRenaming: startNamingNew,
    getProps: getNamingNewProps,
    stopRenaming: stopNamingNew,
    isRenaming: isNamingNew,
  } = useEditableText("", (value: string) => {
    stopNamingNew()
    setIsCreatingGroup(false)
    if (value === "") return
    createItem({ name: value, parentItemId })
  })

  useEffect(() => {
    if (isCreatingGroup && !isNamingNew) {
      startNamingNew()
    }

    if (!isCreatingGroup && isNamingNew) {
      stopNamingNew()
    }
  }, [isCreatingGroup, isNamingNew, startNamingNew, stopNamingNew])

  return (
    <GenericTreeItem key="NEW_GROUP_INPUT" depth={depth} disabled>
      <EditableText
        placeholder="Unnamed"
        {...getNamingNewProps()}
        style={{ color: "var(--light-600)" }}
      />
    </GenericTreeItem>
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
