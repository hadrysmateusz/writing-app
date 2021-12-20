import { ContextMenuItem, ContextSubmenu } from "../../../ContextMenu"
import {
  SortingDirection,
  SortingIndex,
  useSorting,
} from "../../../SortingProvider"

import { SortingMenuItemInnerWrapper } from "../MainHeader.styles"

const SORT_METHODS = { modifiedAt: "Date updated", title: "Title" }

export const CloudDocumentSortingSubmenu: React.FC = () => {
  return (
    <ContextSubmenu text="Sort">
      <SortingMenuItem sortingIndex="titleSlug" sortingDirection="asc">
        {SORT_METHODS.title} A-Z
      </SortingMenuItem>
      <SortingMenuItem sortingIndex="titleSlug" sortingDirection="desc">
        {SORT_METHODS.title} Z-A
      </SortingMenuItem>
      <SortingMenuItem sortingIndex="modifiedAt" sortingDirection="asc">
        {SORT_METHODS.modifiedAt} (Older first)
      </SortingMenuItem>
      <SortingMenuItem sortingIndex="modifiedAt" sortingDirection="desc">
        {SORT_METHODS.modifiedAt} (Newer first)
      </SortingMenuItem>
    </ContextSubmenu>
  )
}

const SortingMenuItem: React.FC<{
  sortingIndex: SortingIndex
  sortingDirection: SortingDirection
}> = ({ sortingIndex, sortingDirection, children }) => {
  const { changeSorting, sorting } = useSorting()

  const isActive =
    sorting.index === sortingIndex && sorting.direction === sortingDirection

  return (
    <ContextMenuItem
      onClick={() => changeSorting(sortingIndex, sortingDirection)}
    >
      <SortingMenuItemInnerWrapper isActive={isActive}>
        {children}
      </SortingMenuItemInnerWrapper>
    </ContextMenuItem>
  )
}
