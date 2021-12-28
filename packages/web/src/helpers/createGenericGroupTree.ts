import { GroupDoc } from "../components/Database"
import { GenericDocGroupTree_Discriminated } from "../types/GenericDocGroup"

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
) => {
  return childGroupIds.reduce<GenericDocGroupTree_Discriminated[]>(
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
) => {
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
): GenericDocGroupTree_Discriminated | undefined {
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
): GenericDocGroupTree_Discriminated => {
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
