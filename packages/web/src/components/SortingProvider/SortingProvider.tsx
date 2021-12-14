import { useState, useCallback, useMemo, memo } from "react"

import { createContext } from "../../utils"

import { ChangeSortingFn, Sorting, SortingContextType } from "./types"

// TODO: save to local settings (persist)
// TODO: support sorting for cloud documents, local documents, tags, and everything else

export const [SortingContext, useSorting] = createContext<SortingContextType>()

const DEFAULT_SORTING: Sorting = {
  index: "titleSlug",
  direction: "asc",
}

export const SortingProvider: React.FC = memo(({ children }) => {
  // State of the sorting options for the documents list
  const [sorting, setSorting] = useState<Sorting>(DEFAULT_SORTING)

  /**
   * Changes the sorting options for the documents list
   */
  const changeSorting: ChangeSortingFn = useCallback((index, direction) => {
    setSorting({ index, direction })
  }, [])

  const sortingContextValue = useMemo(
    () => ({
      sorting,
      changeSorting,
    }),
    [changeSorting, sorting]
  )

  return (
    <SortingContext.Provider value={sortingContextValue}>
      {children}
    </SortingContext.Provider>
  )
})
