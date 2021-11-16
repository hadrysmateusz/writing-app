import { useMemo } from "react"

import createGroupTree, {
  findInTree,
  findChildGroups,
} from "../../../../helpers/createGroupTree"

import { useMainState } from "../../../MainProvider"

export const useFindGroupAndChildGroups = (groupId: string) => {
  const { groups } = useMainState()

  const group = useMemo(() => {
    const groupTree = createGroupTree(groups)
    const group = findInTree(groupTree.children, groupId)

    return group
  }, [groupId, groups])

  const childGroups = useMemo(() => {
    if (group === null) {
      return null
    }
    return findChildGroups(group)
  }, [group])

  return { group, childGroups }
}
