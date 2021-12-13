import { FC, useEffect } from "react"

import { GenericTreeItem } from "../TreeItem"
import { useEditableText, EditableText } from "../RenamingInput"

import { GroupingItemListComponentProps } from "./GroupingItemListComponent"

export type NewGroupingItemInputTreeItemProps = Pick<
  GroupingItemListComponentProps,
  | "depth"
  | "setIsCreatingGroup"
  | "isCreatingGroup"
  | "createItem"
  | "parentItemId"
>

export const NewGroupingItemInputTreeItem: FC<
  NewGroupingItemInputTreeItemProps
> = ({
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
