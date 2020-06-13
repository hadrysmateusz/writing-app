// TODO: rename this file or split it into multiple to reflect its multi-utility nature

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

// TODO: make a more reusable algorithm with customisable keys (types are gonna be more complicated - there are probably ready-made algorithms for that)
export const findInTree = (
  nodes: GroupTreeBranch[],
  searchValue: any
): null | GroupTreeBranch => {
  // Check if any of the direct children contains the deesired node - if so return it
  for (let node of nodes) {
    if (node.id === searchValue) {
      return node
    }
  }
  /* 
  Run the function resursively for all of the child nodes - if it is found in one of them, return it

  If I'm not mistaken this makes this algorithm depth-first
  TODO: turn into a breadth-first search as collections are unlikely to be deeply nested 
  */
  for (let node of nodes) {
    const result = findInTree(node.children, searchValue)
    if (result !== null) {
      return result
    }
  }
  // if the node isn't found return null
  return null
}

/**
 * Finds all child groups of a give group
 *
 * TODO: will need a rework if I decide to use the concept of collection stacks
 */
export const findChildGroups = (node: GroupTreeBranch): GroupTreeBranch[] => {
  let total: GroupTreeBranch[] = []

  for (let child of node.children) {
    // add this child to the list
    total.push(child)
    // ...and all of its children (and effectively all other nested children thanks to recursion)
    total = total.concat(findChildGroups(child))
  }

  return total
}

const createGroupTree = (groups: GroupDoc[]): GroupTree => {
  const plainGroups = groups.map((group) => group.toJSON())
  const groupTree = createBranch(null, plainGroups) as GroupTree
  return groupTree
}

export default createGroupTree
