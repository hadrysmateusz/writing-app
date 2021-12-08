import { FC, useEffect } from "react"

import GroupTreeItem from "./GroupTreeItem"
import { GenericTreeItem } from "../TreeItem"
import Ellipsis from "../Ellipsis"
import { useEditableText, EditableText } from "../RenamingInput"
import { SidebarView } from "../ViewState"
import DirTreeItem from "../DirsList/DirTreeItem"

export type ItemsBranch = {
  itemId: string
  itemName: string
  parentItemId: string | null // TODO: add actual parentItemIds for local branches
  childItems: ItemsBranch[]
}

export const GroupingItemList: FC<{
  view: SidebarView<"primary">
  itemId: string
  childItems: ItemsBranch[]
  depth: number
  isCreatingGroup: boolean
  setIsCreatingGroup: (newValue: boolean) => void
  createItem?: (values: { name?: string }) => void
}> = ({
  depth,
  isCreatingGroup,
  setIsCreatingGroup,
  childItems,
  itemId,
  createItem,
  view,
}) => {
  const isEmpty = childItems.length === 0
  const isRoot = itemId === null

  const {
    startRenaming: startNamingNew,
    getProps: getNamingNewProps,
    stopRenaming: stopNamingNew,
    isRenaming: isNamingNew,
  } = useEditableText("", (value: string) => {
    stopNamingNew()
    setIsCreatingGroup(false)
    if (value === "") return
    createItem && createItem({ name: value }) // TODO: fix this and make not optional
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
    <>
      {isEmpty && !isCreatingGroup ? (
        <GenericTreeItem depth={depth} disabled>
          <Ellipsis style={{ marginLeft: "2px" }}>
            {/* TODO: use cloud/local agnostic naming (or provide option for setting this) */}
            {isRoot ? "No Collections" : "No Nested Collections"}
          </Ellipsis>
        </GenericTreeItem>
      ) : (
        childItems.map((childItemBranch, index) => {
          // render correct children based on view
          const props = {
            key: childItemBranch.itemId,
            depth,
            index,
            item: childItemBranch,
          }
          return view === "local" ? (
            <DirTreeItem {...props} />
          ) : view === "cloud" ? (
            <GroupTreeItem {...props} />
          ) : null
        })
      )}

      {/* TODO: fix the input overflowing the sidebar */}
      {isCreatingGroup && (
        <GenericTreeItem key="NEW_GROUP_INPUT" depth={depth} disabled>
          <EditableText
            placeholder="Unnamed"
            {...getNamingNewProps()}
            style={{ color: "var(--light-600)" }}
          />
        </GenericTreeItem>
      )}
    </>
  )
}
