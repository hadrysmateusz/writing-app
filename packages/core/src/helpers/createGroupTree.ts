// const testGroups: Group[] = [
//   { id: "Writing", parentGroup: "Blog" },
//   { id: "File Handling Guide", parentGroup: "Advanced" },
//   { id: "Blog", parentGroup: null },
//   { id: "Productivity", parentGroup: "Blog" },
//   { id: "Querying DOM Nodes", parentGroup: "Intermediate" },
//   { id: "Javascript", parentGroup: "Tutorials" },
//   { id: "Advanced", parentGroup: "Javascript" },
//   { id: "Tutorials", parentGroup: null },
//   { id: "Intermediate", parentGroup: "Javascript" },
// ]

import { GroupDoc } from "../components/Database"

export type Group = {
  id: string
  name: string
  parentGroup: string | null
} | null

export interface GroupTreeBranch {
  id: string
  name: string
  children: GroupTreeBranch[]
}

export type GroupTree = GroupTreeBranch[]

// TODO: improve type-related stuff
export const createBranch = (
  group: Group | null,
  allGroups: Group[]
): GroupTreeBranch | GroupTree => {
  const id = group === null ? null : group.id

  const children: GroupTreeBranch[] = []

  for (let i = allGroups.length - 1; i >= 0; i--) {
    const currentGroup = allGroups[i]

    // skip groups that have already been used
    if (currentGroup === null) continue

    // if the group belongs to the current parent, move it into place
    if (currentGroup.parentGroup === id) {
      allGroups[i] = null

      const newChildBranch = createBranch(
        currentGroup,
        allGroups
      ) as GroupTreeBranch

      children.push(newChildBranch)
    }
  }

  if (group === null) {
    return children as GroupTree
  } else {
    return {
      id: group.id,
      name: group.name,
      children,
    } as GroupTreeBranch
  }
}

const createGroupTree = (groups: GroupDoc[]): GroupTree => {
  const plainGroups = groups.map((group) => group.toJSON())
  const groupTree = createBranch(null, plainGroups) as GroupTree
  return groupTree
}

export default createGroupTree
