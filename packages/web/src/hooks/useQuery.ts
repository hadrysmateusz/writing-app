import { useMemo } from "react"
import { RxQuery } from "rxdb"

import { MyDatabase, useDatabase } from "../components/Database"
import { Sorting, useSorting } from "../components/SortingProvider"

// TODO: create a sorting-less version

export type QueryCreatorWithSorting<RxDocumentType, RxQueryResult> = (
  db: MyDatabase,
  sorting: Sorting
) => RxQuery<RxDocumentType, RxQueryResult>

export const useQueryWithSorting = <RxDocumentType, RxQueryResult>(
  queryCreator: QueryCreatorWithSorting<RxDocumentType, RxQueryResult>,
  dependencies: any[]
) => {
  const db = useDatabase()
  const { sorting } = useSorting()

  const query = useMemo(
    () => queryCreator(db, sorting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db, queryCreator, sorting, ...dependencies]
  )

  return query
}

export type QueryCreator<RxDocumentType, RxQueryResult> = (
  db: MyDatabase
) => RxQuery<RxDocumentType, RxQueryResult>

export const useQuery = <RxDocumentType, RxQueryResult>(
  queryCreator: QueryCreator<RxDocumentType, RxQueryResult>,
  dependencies: any[]
) => {
  const db = useDatabase()

  const query = useMemo(
    () => queryCreator(db),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db, queryCreator, ...dependencies]
  )

  return query
}
