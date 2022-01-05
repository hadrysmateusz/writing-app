import React, { useMemo, useState } from "react"

import { ValidatePathsObj } from "shared"

import { GenericDocGroupTreeBranch } from "../../../types"

import { ItemsBranch } from "../../GroupingItemList"
import { useLocalFS } from "../../LocalFSProvider"
import { GenericAddButton } from "../../TreeItem"
import { usePrimarySidebar } from "../../ViewState"
import { DirsList } from "../../DirsList"

import { SectionHeader, SectionContainer } from "../Common"

// TODO: probably rename to dirs section

const MSG_DIRECTORIES_HEADER = "Local Library"

export const createGroupingItemBranchFromDir = (
  dirTree: GenericDocGroupTreeBranch,
  validatePathObjects: ValidatePathsObj[]
): ItemsBranch => {
  const validatePathObj = validatePathObjects.find(
    (pathObj) => pathObj.path === dirTree.identifier
  )

  return {
    itemId: dirTree.identifier,
    itemName: dirTree.name,
    parentItemId: dirTree.parentIdentifier,
    childItems: dirTree.childGroups.map((dirTree) =>
      createGroupingItemBranchFromDir(dirTree, validatePathObjects)
    ),
    exists: validatePathObj?.exists, // intentionally returns undefined if validatePathObj wasn't found because that most likely means the path is a child,
  }
}

export const DirectoriesSection: React.FC = () => {
  const { dirTrees, validatePathObjects } = useLocalFS()

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)

  const itemsTree = useMemo(() => {
    return dirTrees.map((dirTree) =>
      createGroupingItemBranchFromDir(dirTree, validatePathObjects)
    )
  }, [dirTrees, validatePathObjects])

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
