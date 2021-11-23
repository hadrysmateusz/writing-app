import { FC, useEffect } from "react"

import { GroupTreeBranch } from "../../helpers/createGroupTree"
import GroupTreeItem from "./GroupTreeItem"
import { GenericTreeItem } from "../TreeItem"
import Ellipsis from "../Ellipsis"
import { useEditableText, EditableText } from "../RenamingInput"
import { useGroupsAPI } from "../MainProvider"

export const GroupsList: FC<{
  group: GroupTreeBranch
  depth: number
  isCreatingGroup: boolean
  setIsCreatingGroup: (newValue: boolean) => void
}> = ({ group, depth, isCreatingGroup, setIsCreatingGroup }) => {
  const isEmpty = group.children.length === 0
  const isRoot = group.id === null
  const { createGroup } = useGroupsAPI()

  const {
    startRenaming: startNamingNew,
    getProps: getNamingNewProps,
    stopRenaming: stopNamingNew,
    isRenaming: isNamingNew,
  } = useEditableText("", (value: string) => {
    stopNamingNew()
    setIsCreatingGroup(false)
    if (value === "") return
    createGroup(group.id, { name: value })
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
            {isRoot ? "No Collections" : "No Nested Collections"}
          </Ellipsis>
        </GenericTreeItem>
      ) : (
        group.children.map((childGroupTreeBranch, index) => (
          <GroupTreeItem
            key={childGroupTreeBranch.id}
            group={childGroupTreeBranch}
            depth={depth}
            index={index}
          />
        ))
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
