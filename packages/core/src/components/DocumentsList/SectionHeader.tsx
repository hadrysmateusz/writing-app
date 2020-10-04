import React, { useMemo } from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI, useMainState } from "../MainProvider"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import Icon from "../Icon"
import { ANIMATION_FADEIN, ellipsis } from "../../style-utils"

const SORT_METHODS = { modifiedAt: "Date updated", title: "Title" }

export const SectionHeader: React.FC<{ groupId?: string | null }> = ({
  groupId,
  children,
}) => {
  const { changeSorting, sorting } = useMainState()
  const { createDocument } = useDocumentsAPI()

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()
  const {
    openMenu: openSortingMenu,
    isMenuOpen: isSortingMenuOpen,
    ContextMenu: SortingContextMenu,
  } = useContextMenu()

  const handleNewDocument = () => {
    if (groupId !== undefined) {
      createDocument(groupId)
    }
    closeMenu()
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (groupId === undefined) return
    openMenu(e)
  }

  // TODO: make sorting a per-group setting
  const handleChangeSorting = (e: React.MouseEvent<HTMLDivElement>) => {
    openSortingMenu(e)
  }

  const sortByText = useMemo(() => {
    return SORT_METHODS[sorting.index]
  }, [sorting.index])

  return (
    <>
      <SectionHeaderContainer isSortingMenuOpen={isSortingMenuOpen}>
        {/* TODO: fix the context menu */}
        <div className="SectionHeader_Name" onContextMenu={handleContextMenu}>
          {children}
        </div>
        <div
          className="SectionHeader_SortBy"
          onClick={handleChangeSorting}
          title="Change sorting method"
        >
          {/* TODO: consider replacing this index-based text with a simple "Sort By" and mark the current one as active in the dropdown */}
          <div>{sortByText}</div> <Icon icon="chevronDown" />
        </div>
      </SectionHeaderContainer>

      <ContextMenu>
        <ContextMenuItem onClick={handleNewDocument}>
          New Document
        </ContextMenuItem>
      </ContextMenu>

      <SortingContextMenu>
        <ContextMenuItem onClick={() => changeSorting("title", "asc")}>
          {SORT_METHODS.title}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => changeSorting("modifiedAt", "desc")}>
          {SORT_METHODS.modifiedAt}
        </ContextMenuItem>
      </SortingContextMenu>
    </>
  )
}

const SectionHeaderContainer = styled.div<{ isSortingMenuOpen: boolean }>`
  --padding-x: 20px;
  --padding-y: 8px;

  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  user-select: none;

  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-bottom: 1px solid;
  border-color: #383838;
  color: #a3a3a3;
  background: #1c1c1c;

  display: flex;

  .SectionHeader_Name {
    padding: var(--padding-y);
    padding-left: var(--padding-x);

    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    ${ellipsis}
  }

  .SectionHeader_SortBy {
    padding: var(--padding-y);
    padding-right: calc(var(--padding-x) - 3px);

    display: ${(p) => (p.isSortingMenuOpen ? "flex" : "none")};
    cursor: pointer;
    white-space: nowrap;
    padding-left: 6px;

    > :first-child {
      margin-right: 3px;
    }

    animation: 200ms ease-out both ${ANIMATION_FADEIN};
  }

  :hover .SectionHeader_SortBy {
    display: flex;
  }
`
