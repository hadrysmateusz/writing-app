import React, { useMemo, useState } from "react"

import { ItemsBranch } from "../GroupingItemList"
import { useLocalFS } from "../LocalFSProvider"
import { DirObjectRecursive } from "../PrimarySidebar/views/LocalView/types"

import { SectionHeader, SectionContainer } from "./Common"
import { GenericAddButton } from "../TreeItem"
import { usePrimarySidebar } from "../ViewState"
import { DirsList } from "../DirsList/DirsList"

// TODO: probably rename to dirs section

const MSG_DIRECTORIES_HEADER = "Local Library"

export const createGroupingItemBranchFromDirObject = (
  dirTree: DirObjectRecursive
): ItemsBranch => {
  return {
    itemId: dirTree.path,
    itemName: dirTree.name,
    // TODO: add parentDir information to local dirs tree
    parentItemId: /* dirTree.parentGroup */ null,
    childItems: dirTree.dirs.map((dirTree) =>
      createGroupingItemBranchFromDirObject(dirTree)
    ),
  }
}

export const DirectoriesSection: React.FC = () => {
  const { dirTrees } = useLocalFS()

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const itemsTree = useMemo(() => {
    return dirTrees.map((dirTree) =>
      createGroupingItemBranchFromDirObject(dirTree)
    )
  }, [dirTrees])

  return dirTrees.length > 0 ? (
    <SectionContainer>
      <DirectoriesSectionHeader />

      <DirsList
        parentItemId={null}
        childItems={itemsTree}
        depth={1}
        isCreatingGroup={isCreatingGroup}
        setIsCreatingGroup={setIsCreatingGroup}
      />
    </SectionContainer>
  ) : null
}

const DirectoriesSectionHeader = () => {
  const primarySidebar = usePrimarySidebar()
  const { addPath } = useLocalFS()

  const handleClick = (_e) => {
    primarySidebar.switchSubview("local", "all")
  }

  const handleAddClick = () => {
    addPath()
  }

  return (
    <SectionHeader withHover={true} onClick={handleClick}>
      <div>{MSG_DIRECTORIES_HEADER}</div>
      <GenericAddButton onAdd={handleAddClick} />
    </SectionHeader>
  )
}
