import React, { FC, useEffect } from "react"
import styled from "styled-components/macro"
import { Droppable } from "react-beautiful-dnd"

import { GroupTreeBranch } from "../../helpers/createGroupTree"
import GroupTreeItem from "../Sidebar/GroupTreeItem"
import { TreeItem } from "../TreeItem"
import Ellipsis from "../Ellipsis"
import { useEditableText, EditableText } from "../RenamingInput"
import { useGroupsAPI } from "../MainProvider"

const GROUP_TREE_ROOT = "group_tree_root"

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
    <Droppable droppableId={isRoot ? GROUP_TREE_ROOT : group.id}>
      {({ innerRef, droppableProps, placeholder }) => (
        <Container ref={innerRef} {...droppableProps}>
          {isEmpty && !isCreatingGroup ? (
            <TreeItem depth={depth} disabled>
              <Ellipsis style={{ marginLeft: "2px" }}>
                {isRoot ? "No Collections" : "No Nested Collections"}
              </Ellipsis>
            </TreeItem>
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
            <TreeItem key="NEW_GROUP_INPUT" depth={depth} disabled>
              <EditableText
                placeholder="Unnamed"
                {...getNamingNewProps()}
                style={{ color: "#f0f0f0" }}
              />
            </TreeItem>
          )}

          {placeholder}
        </Container>
      )}
    </Droppable>
  )
}

const Container = styled.div``
