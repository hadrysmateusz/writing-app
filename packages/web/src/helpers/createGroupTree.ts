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

import { GroupDoc, GroupDocType } from "../components/Database"

export interface GroupTreeBranch extends GroupDocType {
  children: GroupTreeBranch[]
}

// TODO: make a more reusable algorithm with customizable keys (types are gonna be more complicated - there are probably ready-made algorithms for that)
export const findInTree = (
  nodes: GroupTreeBranch[],
  searchValue: string
): null | GroupTreeBranch => {
  // Check if any of the direct children contains the desired node - if so return it
  for (let node of nodes) {
    if (node.id === searchValue) {
      return node
    }
  }

  /* 
  Run the function recursively for all of the child nodes - if it is found in one of them, return it

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

// TODO: improve type-related stuff
export const createBranch = (
  group: GroupDocType | null,
  allGroups: (GroupDocType | null)[]
): GroupTreeBranch => {
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

  return {
    id: group ? group.id : null,
    name: group ? group.name : "All Collections",
    children,
    // TODO: having both id and parentGroup set to null (for root group) sounds like a recipe for disaster so I might have to bring back a unique string id for the root group
    parentGroup: group ? group.parentGroup : null,
  } as GroupTreeBranch
}

const createGroupTree = (allGroups: GroupDoc[]): GroupTreeBranch => {
  const plainGroups = allGroups.map((group) => group.toJSON())
  const groupTree = createBranch(null, plainGroups)
  return groupTree
}

export default createGroupTree
