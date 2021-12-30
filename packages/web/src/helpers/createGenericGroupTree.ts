import { DirObjectRecursive } from "shared"

import { GroupDoc } from "../components/Database"
import {
  GenericDocGroupTreeBranch,
  GenericDocGroupTreeRoot,
  GenericDocGroupTree_Discriminated,
} from "../types"

import { createGenericDocumentFromLocalFile } from "./genericDocuments"

const getChildGroupIds = (
  allGroups: GroupDoc[],
  rootGroupId: string | null
) => {
  return allGroups.reduce<string[]>((acc, val) => {
    if (val.parentGroup === rootGroupId) {
      return [...acc, val.id]
    } else {
      return acc
    }
  }, [])
}

const createGenericChildGroupsFromIds = (
  allGroups: GroupDoc[],
  childGroupIds: string[]
): GenericDocGroupTreeBranch[] => {
  return childGroupIds.reduce<GenericDocGroupTreeBranch[]>(
    (childGroups, groupId) => {
      const childGroup = createGenericGroupTreeBranch(allGroups, groupId)
      return childGroup ? [...childGroups, childGroup] : childGroups
    },
    []
  )
}

const createGenericChildGroups = (
  allGroups: GroupDoc[],
  rootGroupId: string | null
): GenericDocGroupTreeBranch[] => {
  const childGroupIds = getChildGroupIds(allGroups, rootGroupId)
  const childGroups = createGenericChildGroupsFromIds(allGroups, childGroupIds)
  return childGroups
}

const findGroupMatchingId = (allGroups: GroupDoc[], groupId: string) => {
  return allGroups.find((group) => group.id === groupId)
}

export function createGenericGroupTreeBranch(
  allGroups: GroupDoc[],
  rootGroupId: string
): GenericDocGroupTreeBranch | undefined {
  const group = findGroupMatchingId(allGroups, rootGroupId)

  if (!group) return undefined

  const childGroups = createGenericChildGroups(allGroups, rootGroupId)

  return {
    identifier: group.id,
    name: group.name,
    parentIdentifier: group.parentGroup,
    childDocuments: [],
    childGroups,
  }
}

export const createGenericGroupTreeRoot = (
  allGroups: GroupDoc[]
): GenericDocGroupTreeRoot => {
  const childGroups = createGenericChildGroups(allGroups, null)

  return {
    identifier: null,
    childDocuments: [],
    childGroups,
  }
}

export function createGenericGroupTreeFromCloudGroups(
  allGroups: GroupDoc[],
  rootGroupId: string | null
): GenericDocGroupTree_Discriminated | undefined {
  if (typeof rootGroupId === "string") {
    return createGenericGroupTreeBranch(allGroups, rootGroupId)
  } else {
    return createGenericGroupTreeRoot(allGroups)
  }
}

export function createGenericGroupTreeFromLocalDir(
  dir: DirObjectRecursive
): GenericDocGroupTreeBranch {
  return {
    identifier: dir.path,
    name: dir.name,
    parentIdentifier: dir.parentDirectory,
    childDocuments: dir.files.map((file) =>
      createGenericDocumentFromLocalFile(file)
    ),
    childGroups: dir.dirs.map((childDir) =>
      createGenericGroupTreeFromLocalDir(childDir)
    ),
  }
}
