import { GenericDocument } from "./GenericDocument"

export type GenericDocGroup = {
  identifier: string
  name: string
  parentIdentifier: string | null
}

// TODO: rethink the namingc
export type GenericDocGroupTreeRoot = {
  identifier: null
  childDocuments: GenericDocument[]
  childGroups: GenericDocGroupTree_Discriminated[]
}
export type GenericDocGroupTreeBranch = {
  identifier: string
  name: string
  parentIdentifier: string | null
  childDocuments: GenericDocument[]
  childGroups: GenericDocGroupTree_Discriminated[]
}

export type GenericDocGroupTree_Discriminated =
  | GenericDocGroupTreeBranch
  | GenericDocGroupTreeRoot

/**
 * Consideration list:
 * - position - from cloud groups. maybe create a special type for groups used in sortable trees (or just use it in the tree variant of this type)
 */
