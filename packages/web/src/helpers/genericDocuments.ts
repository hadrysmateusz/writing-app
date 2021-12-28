import { DocumentDoc } from "../components/Database"
import { GenericDocGroupTree_Discriminated } from "../types/GenericDocGroup"
import { GenericDocument_Discriminated } from "../types"

/**
 * Creates a generic document from a cloud document
 *
 * @param cloudDoc A cloud document object from RxDB
 * @returns Generic document object (discriminated, cloud variant)
 */
export const createGenericDocumentFromCloudDocument = (
  cloudDoc: DocumentDoc
): GenericDocument_Discriminated => {
  return {
    documentType: "cloud",
    identifier: cloudDoc.id,
    name: cloudDoc.title,
    parentIdentifier: cloudDoc.parentGroup,
    createdAt: cloudDoc.createdAt,
    modifiedAt: cloudDoc.modifiedAt,
    content: cloudDoc.content,
    tags: cloudDoc.tags,
  }
}

/**
 * Gets all groupIDs in the entire GenericDocGroupTree, including all nested groups/branches.
 *
 * @param groupTree GenericDocGroupTree (root or branch) from which to extract all group IDs. Can be undefined, an empty array will be returned. This is an option to decrease the need for null/undefined checks in higher level logic.
 * @param includeRoot Whether to include the ID of the root tree node (the groupTree object passed as param).
 * @returns An array of groupId strings representing all nested IDs/paths.
 */
export const getAllGroupIdsInGenericTree = (
  groupTree: GenericDocGroupTree_Discriminated | undefined,
  includeRoot: boolean = true
): string[] => {
  if (!groupTree) {
    return []
  }
  const groupIds: string[] = []
  if (includeRoot && groupTree.identifier !== null) {
    groupIds.push(groupTree.identifier)
  }
  for (let childGroup of groupTree.childGroups) {
    groupIds.push(...getAllGroupIdsInGenericTree(childGroup))
  }
  return groupIds
}

/**
 * Fills an existing GenericDocGroupTree with documents from the passed in array in correct spots based on the documents' parentIdentifier
 *
 * @param groupTree GenericDocGroupTree without documents to be filled.
 * @param documents A flat list of all generic documents to fill the tree with.
 * @returns A GenericDocGroupTree filled in with documents from the array in correct spots.
 */
export function fillGenericGroupTreeWithDocuments<
  T extends GenericDocGroupTree_Discriminated | undefined
>(groupTree: T, documents: GenericDocument_Discriminated[]): T {
  if (groupTree === undefined) {
    return groupTree
  }
  groupTree.childDocuments = documents.filter(
    (doc) => doc.parentIdentifier === groupTree.identifier
  )
  groupTree.childGroups = groupTree.childGroups.map((childGroupTree) =>
    fillGenericGroupTreeWithDocuments(childGroupTree, documents)
  )
  return groupTree
}

// =========================================================================

// type GenericDocGroupTreeType<T extends string | null> = T extends string
//   ? GenericDocGroupTreeBranch | undefined
//   : T extends null
//   ? GenericDocGroupTreeRoot
//   : never

// export function createGenericGroupTreeFromCloudGroups<T extends string | null>(
//   allGroups: GroupDoc[],
//   rootGroupId: T
// ): GenericDocGroupTreeType<T> {
//   if (typeof rootGroupId === "string") {
//     const foo = createGenericGroupTreeBranch(allGroups, rootGroupId)
//     return foo as GenericDocGroupTreeType<typeof rootGroupId>
//   } else {
//     const bar = createGenericGroupTreeRoot(allGroups)
//     return bar as GenericDocGroupTreeType<typeof rootGroupId>
//   }
// }
