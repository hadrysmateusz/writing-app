import { FunctionComponent } from "react"
import styled from "styled-components/macro"

import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import Icon from "../Icon"
import { SortingIndex, SortingDirection, useMainState } from "../MainProvider"
import { CloudViews, PrimarySidebarViews, useViewState } from "../ViewState"

const SORT_METHODS = { modifiedAt: "Date updated", title: "Title" }

export const MainHeader: FunctionComponent<{
  title: string
  parentGroupId?: string | null
  numSubgroups?: number
}> = ({ title, parentGroupId, numSubgroups }) => {
  const { primarySidebar } = useViewState()

  const {
    openMenu: openSortingMenu,
    ContextMenu: SortingContextMenu,
  } = useContextMenu()

  // TODO: use real documents data in MainHeader_Detail

  return (
    <Wrapper>
      <div className="MainHeader_HorizontalContainer">
        <div>
          <div className="MainHeader_MainText">{title}</div>
          <div className="MainHeader_Details">
            X documents{numSubgroups ? `, ${numSubgroups} collections` : null}
          </div>
        </div>

        {parentGroupId !== undefined ? (
          <div
            className="MainHeader_ButtonContainer"
            onClick={() => {
              if (parentGroupId === null) {
                primarySidebar.switchSubview(
                  PrimarySidebarViews.cloud,
                  CloudViews.ALL
                )
              } else {
                primarySidebar.switchSubview(
                  PrimarySidebarViews.cloud,
                  parentGroupId
                )
              }
            }}
            title="Go to parent collection"
          >
            <Icon icon="arrow90DegUp" />
          </div>
        ) : null}

        <div
          className="MainHeader_ButtonContainer"
          onClick={(e) => {
            openSortingMenu(e)
          }}
          title="Change sorting method"
        >
          <Icon icon="sort" />
        </div>
      </div>

      <SortingContextMenu>
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
      </SortingContextMenu>
    </Wrapper>
  )
}

const SortingMenuItem: FunctionComponent<{
  sortingIndex: SortingIndex
  sortingDirection: SortingDirection
}> = ({ sortingIndex, sortingDirection, children }) => {
  const { changeSorting, sorting } = useMainState()

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

const SortingMenuItemInnerWrapper = styled.span<{ isActive: boolean }>`
  font-weight: ${(p) => (p.isActive ? `bold` : `normal`)};
`

const Wrapper = styled.div`
  --padding-x: 24px;
  --padding-y: 20px;

  padding: var(--padding-y) var(--padding-x);

  .MainHeader_MainText {
    color: var(--light-600);
    font-size: 12px;
    font-weight: bold;

    margin-bottom: 8px;
  }

  .MainHeader_Details {
    color: var(--light-400);
    font-size: 10px;
    font-weight: normal;
  }

  .MainHeader_HorizontalContainer {
    display: grid;
    grid-template-columns: auto repeat(2, min-content);
    /* gap: 8px; */
  }

  .MainHeader_ButtonContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    --padding-x: 4px;
    padding: 0 var(--padding-x);
    margin-right: calc(-1 * var(--padding-x));
    margin-left: 8px;

    font-size: 18px;
    cursor: pointer;

    color: var(--light-100);

    :hover {
      color: var(--light-400);
    }
  }
`

export default MainHeader
