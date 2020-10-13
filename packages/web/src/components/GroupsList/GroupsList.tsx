import React, { FC, useEffect } from "react"

import { GroupTreeBranch } from "../../helpers/createGroupTree"
import GroupTreeItem from "../Sidebar/GroupTreeItem"
import { TreeItem } from "../TreeItem"
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
    </>
  )
}

// import React, { FC, useEffect, useState } from "react"
// import styled from "styled-components/macro"
// import { Droppable } from "react-beautiful-dnd"

// import GroupTreeItem from "../Sidebar/GroupTreeItem"
// import { TreeItem } from "../TreeItem"
// import Ellipsis from "../Ellipsis"
// import { useEditableText, EditableText } from "../RenamingInput"
// import { useGroupsAPI } from "../MainProvider"
// import { ROOT_GROUP_ID } from "../Database/constants"
// import { useDatabase, GroupDoc, GroupDocType } from "../Database"

// export const GroupsList: FC<{
//   group: GroupDocType
//   depth: number
//   isCreatingGroup: boolean
//   setIsCreatingGroup: (newValue: boolean) => void
// }> = ({ group, depth, isCreatingGroup, setIsCreatingGroup }) => {
//   const { createGroup } = useGroupsAPI()
//   const db = useDatabase()

//   const [groups, setGroups] = useState<GroupDocType[]>([])

//   // const isEmpty = group.childGroups.length === 0
//   const isRoot = group.id === ROOT_GROUP_ID

//   // useEffect(() => {
//   //   console.log("grouplist group", group)
//   //   db.groups.findByIds(group.childGroups).then((childGroups) => {
//   //     const childGroupsArray = group.childGroups.map((groupId) => {
//   //       const groupDoc = childGroups.get(groupId)
//   //       if (!groupDoc) {
//   //         throw Error("Can't find group")
//   //       }
//   //       return groupDoc.toJSON()
//   //     })
//   //     setGroups(childGroupsArray /* .reverse() */)
//   //   })
//   // }, [db.groups, group, group.childGroups])

//   const {
//     startRenaming: startNamingNew,
//     getProps: getNamingNewProps,
//     stopRenaming: stopNamingNew,
//     isRenaming: isNamingNew,
//   } = useEditableText("", (value: string) => {
//     stopNamingNew()
//     setIsCreatingGroup(false)
//     if (value === "") return
//     createGroup(group.id, { name: value })
//   })

//   useEffect(() => {
//     if (isCreatingGroup && !isNamingNew) {
//       startNamingNew()
//     }

//     if (!isCreatingGroup && isNamingNew) {
//       stopNamingNew()
//     }
//   }, [isCreatingGroup, isNamingNew, startNamingNew, stopNamingNew])

//   console.log("rendering group", group, "childGroups", groups)

//   return (
//     <Droppable droppableId={isRoot ? ROOT_GROUP_ID : group.id}>
//       {({ innerRef, droppableProps, placeholder }) => (
//         <Container ref={innerRef} {...droppableProps}>
//           {isEmpty && !isCreatingGroup ? (
//             <TreeItem depth={depth} disabled>
//               <Ellipsis style={{ marginLeft: "2px" }}>
//                 {isRoot ? "No Collections" : "No Nested Collections"}
//               </Ellipsis>
//             </TreeItem>
//           ) : (
//             groups.map((group, index) => (
//               <GroupTreeItem
//                 key={group.id}
//                 group={group}
//                 depth={depth}
//                 index={index}
//               />
//             ))
//           )}

//           {/* TODO: fix the input overflowing the sidebar */}
//           {isCreatingGroup && (
//             <TreeItem key="NEW_GROUP_INPUT" depth={depth} disabled>
//               <EditableText
//                 placeholder="Unnamed"
//                 {...getNamingNewProps()}
//                 style={{ color: "#f0f0f0" }}
//               />
//             </TreeItem>
//           )}

//           {placeholder}
//         </Container>
//       )}
//     </Droppable>
//   )
// }

// const Container = styled.div``
