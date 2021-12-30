import React, { useMemo, useState } from "react"

import { ItemsBranch } from "../../GroupingItemList"
import { useLocalFS } from "../../LocalFSProvider"
import { GenericAddButton } from "../../TreeItem"
import { usePrimarySidebar } from "../../ViewState"
import { DirsList } from "../../DirsList"

import { SectionHeader, SectionContainer } from "../Common"
import { GenericDocGroupTreeBranch } from "../../../types"

// TODO: probably rename to dirs section

const MSG_DIRECTORIES_HEADER = "Local Library"

export const createGroupingItemBranchFromDirObject = (
  dirTree: GenericDocGroupTreeBranch
): ItemsBranch => {
  return {
    itemId: dirTree.identifier,
    itemName: dirTree.name,
    // TODO: add parentDir information to local dirs tree
    parentItemId: /* dirTree.parentGroup */ null,
    childItems: dirTree.childGroups.map((dirTree) =>
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
