import React, { FC } from "react"
import styled from "styled-components/macro"
import { Droppable } from "react-beautiful-dnd"

import { GroupTreeBranch } from "../../helpers/createGroupTree"
import GroupTreeItem from "../Sidebar/GroupTreeItem"

const GROUP_TREE_ROOT = "group_tree_root"

export const GroupsList: FC<{ group: GroupTreeBranch; depth: number }> = ({
  group,
  depth,
}) => {
  const { id, children } = group
  return (
    <Droppable droppableId={id ?? GROUP_TREE_ROOT}>
      {({ innerRef, droppableProps, placeholder }) => (
        <Container ref={innerRef} {...droppableProps}>
          {children.map((childGroupTreeBranch, index) => (
            <GroupTreeItem
              key={childGroupTreeBranch.id}
              group={childGroupTreeBranch}
              depth={depth}
              index={index}
            />
          ))}
          {placeholder}
        </Container>
      )}
    </Droppable>
  )
}

const Container = styled.div``
