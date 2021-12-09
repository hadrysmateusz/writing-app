import React, { FunctionComponent } from "react"
import styled from "styled-components/macro"

import { ContextMenuItem, useContextMenu } from "../ContextMenu/Old"
import Icon from "../Icon"
import { SortingIndex, SortingDirection, useMainState } from "../MainProvider"
import { parseSidebarPath, usePrimarySidebar } from "../ViewState"

const SORT_METHODS = { modifiedAt: "Date updated", title: "Title" }

export const MainHeader: FunctionComponent<{
  title: string
  numSubgroups?: number
  goUpPath?: string
}> = ({ title, numSubgroups, goUpPath }) => {
  const { switchSubview } = usePrimarySidebar()

  const {
    isMenuOpen: isSortingMenuOpen,
    openMenu: openSortingMenu,
    ContextMenu: SortingContextMenu,
  } = useContextMenu()

  // function qwer<S extends SidebarSidebar>() {
  //   return function asdf<
  //     V extends SidebarView<S>,
  //     SV extends SidebarSubview<S, V>,
  //     ID extends string
  //   >(v: V, sv: SV, id: ID) {}
  // }

  // function asdf2<
  //   S extends SidebarSidebar,
  //   V extends SidebarView<S>,
  //   SV extends SidebarSubview<S, V>,
  //   ID extends string
  // >(s: S, v: V, sv: SV, id: ID) {}

  const handleGoUpButtonClick = () => {
    if (!goUpPath) {
      return
    }

    console.log("handleGoUpButtonClick")

    const parsedSidebarPath = parseSidebarPath(goUpPath)

    if (!parsedSidebarPath) {
      return
    }

    const { view, subview, id } = parsedSidebarPath

    // TODO: figure out some fallbacks in case the arguments are invalid
    switchSubview(view as any, subview as any, id)
  }

  const handleOnSortingButtonClick = (e) => {
    openSortingMenu(e)
  }

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

        {goUpPath !== undefined ? (
          <MainHeaderButton
            tooltip="Go to parent collection"
            icon="arrow90DegUp"
            action={handleGoUpButtonClick}
          />
        ) : null}

        <MainHeaderButton
          tooltip="Change sorting method"
          icon="sort"
          action={handleOnSortingButtonClick}
        />
      </div>

      {isSortingMenuOpen ? (
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
      ) : null}
    </Wrapper>
  )
}

const MainHeaderButton: FunctionComponent<{
  icon: string
  tooltip: string
  action: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ icon, action, tooltip }) => {
  return (
    <div
      className="MainHeader_ButtonContainer"
      onClick={action}
      title={tooltip}
    >
      <Icon icon={icon} />
    </div>
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
