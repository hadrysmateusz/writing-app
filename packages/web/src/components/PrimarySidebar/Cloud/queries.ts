import { MyDatabase } from "../../Database"
import { Sorting } from "../../SortingProvider"

export const createFindDocumentsInGroupQuery = (
  db: MyDatabase,
  sorting: Sorting,
  groupId: string
) => {
  return db.documents
    .findNotRemoved()
    .where("parentGroup")
    .eq(groupId)
    .sort({
      [sorting.index]: sorting.direction,
    })
}

export const createFindDocumentsAtRootQuery = (
  db: MyDatabase,
  sorting: Sorting
) => {
  return db.documents
    .findNotRemoved()
    .where("parentGroup")
    .eq(null)
    .sort({
      [sorting.index]: sorting.direction,
    })
}

export const createFindDeletedDocumentsQuery = (
  db: MyDatabase,
  sorting: Sorting
) => {
  return db.documents
    .find()
    .where("isDeleted")
    .eq(true)
    .sort({ [sorting.index]: sorting.direction })
}

export const createFindAllDocumentsQuery = (
  db: MyDatabase,
  sorting: Sorting
) => {
  return db.documents
    .findNotRemoved()

    .sort({
      [sorting.index]: sorting.direction,
    })
}
