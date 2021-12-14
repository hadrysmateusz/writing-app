export type SortingDirection = "asc" | "desc"

export type SortingIndex = "modifiedAt" | "titleSlug"

export type Sorting = {
  index: SortingIndex
  direction: SortingDirection
}

export type ChangeSortingFn = (
  index: SortingIndex,
  direction: SortingDirection
) => void

export type SortingContextType = {
  sorting: Sorting
  changeSorting: ChangeSortingFn
}
