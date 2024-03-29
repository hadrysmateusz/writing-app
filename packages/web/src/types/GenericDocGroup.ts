import { GenericDocument_Discriminated } from "./GenericDocument_Discriminated"

export type GenericDocGroup = {
  identifier: string
  name: string
  parentIdentifier: string | null
}

// TODO: rethink the naming (probably remove all of the _Discriminated suffixes and remove non-discriminated variants)
export type GenericDocGroupTreeRoot = {
  identifier: null
  childDocuments: GenericDocument_Discriminated[]
  childGroups: GenericDocGroupTreeBranch[]
}
export type GenericDocGroupTreeBranch = {
  identifier: string
  name: string
  parentIdentifier: string | null
  childDocuments: GenericDocument_Discriminated[]
  childGroups: GenericDocGroupTreeBranch[]
}

export type GenericDocGroupTree_Discriminated =
  | GenericDocGroupTreeBranch
  | GenericDocGroupTreeRoot

/**
 * Consideration list:
 * - position - from cloud groups. maybe create a special type for groups used in sortable trees (or just use it in the tree variant of this type)
 */
