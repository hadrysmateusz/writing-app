import React, { useMemo, useState } from "react"

import { ItemsBranch } from "../GroupsList"
import { useLocalFS } from "../LocalFSProvider"
import { DirObjectRecursive } from "../PrimarySidebar/views/LocalView/types"
import DirTreeItem from "../DirsList/DirTreeItem"

import { SectionHeader, SectionContainer } from "./Common"
import { GenericTreeItem } from "../TreeItem"
import { usePrimarySidebar } from "../ViewState"

const MSG_DIRECTORIES_HEADER = "Local Library"

// const createGroupingItemBranch = (
//   groupTreeBranch: GroupTreeBranch
// ): ItemsBranch => {
//   return {
//     itemId: groupTreeBranch.id,
//     itemName: groupTreeBranch.name,
//     parentItemId: groupTreeBranch.parentGroup,
//     childItems: groupTreeBranch.children.map((childGroupBranch) =>
//       createGroupingItemBranch(childGroupBranch)
//     ),
//   }
// }
export const createGroupingItemBranch = (
  dirTree: DirObjectRecursive
): ItemsBranch => {
  return {
    itemId: dirTree.path,
    itemName: dirTree.name,
    parentItemId: /* dirTree.parentGroup */ null,
    childItems: dirTree.dirs.map((dirTree) =>
      createGroupingItemBranch(dirTree)
    ),
  }
}

export const DirectoriesSection: React.FC = () => {
  const { dirTrees, addPath } = useLocalFS()

  const itemsTree = useMemo(() => {
    return dirTrees.map((dirTree) => createGroupingItemBranch(dirTree))
  }, [dirTrees])

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  // const [expandedKeys, setExpandedKeys] = useState([])

  // const handleNewGroup = useCallback(() => {
  //   setIsCreatingGroup(true)
  // }, [])

  // // TODO: remove/reduce duplication with GroupsList
  // const {
  //   startRenaming: startNamingNew,
  //   getProps: getNamingNewProps,
  //   stopRenaming: stopNamingNew,
  //   isRenaming: isNamingNew,
  // } = useEditableText("", (value: string) => {
  //   stopNamingNew()
  //   setIsCreatingGroup(false)
  //   if (value === "") return
  //   addPath(value)
  // })

  // useEffect(() => {
  //   if (isCreatingGroup && !isNamingNew) {
  //     startNamingNew()
  //   }

  //   if (!isCreatingGroup && isNamingNew) {
  //     stopNamingNew()
  //   }
  // }, [isCreatingGroup, isNamingNew, startNamingNew, stopNamingNew])

  return dirTrees.length > 0 ? (
    <SectionContainer>
      <DirectoriesSectionHeader />

      {itemsTree.map((dirTree, index) => (
        <DirTreeItem
          key={dirTree.itemId}
          depth={1}
          index={index}
          item={dirTree}
        />
      ))}

      {!isCreatingGroup ? (
        <GenericTreeItem
          icon="plus"
          onClick={() => {
            addPath()
          }}
          depth={0}
        >
          Add Folder
        </GenericTreeItem>
      ) : // <GenericTreeItem key="NEW_GROUP_INPUT" depth={0} disabled>
      //   <EditableText
      //     placeholder="Unnamed"
      //     {...getNamingNewProps()}
      //     style={{ color: "var(--light-600)" }}
      //   />
      // </GenericTreeItem>
      null}
    </SectionContainer>
  ) : null
}

const DirectoriesSectionHeader = () => {
  const primarySidebar = usePrimarySidebar()

  const handleClick = (_e) => {
    primarySidebar.switchSubview("local", "all")
  }

  return (
    <SectionHeader withHover={true} onClick={handleClick}>
      {MSG_DIRECTORIES_HEADER}
    </SectionHeader>
  )
}
