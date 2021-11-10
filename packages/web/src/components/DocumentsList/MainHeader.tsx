import { FunctionComponent } from "react"
import styled from "styled-components/macro"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import Icon from "../Icon"
import { useMainState } from "../MainProvider"
import { CloudViews, PrimarySidebarViews, useViewState } from "../ViewState"

// TODO: remove duplication of sorting context menu code with SectionHeader
const SORT_METHODS = { modifiedAt: "Date updated", title: "Title" }

export const MainHeader: FunctionComponent<{
  title: string
  parentGroupId?: string | null
}> = ({ title, parentGroupId }) => {
  const { primarySidebar } = useViewState()
  const { changeSorting } = useMainState()

  const {
    openMenu: openSortingMenu,
    isMenuOpen: isSortingMenuOpen,
    ContextMenu: SortingContextMenu,
  } = useContextMenu()

  console.warn("IMPLEMENT: use real data in MainHeader_Details")

  return (
    <Wrapper>
      <div className="MainHeader_HorizontalContainer">
        <div>
          <div className="MainHeader_MainText">{title}</div>
          <div className="MainHeader_Details">5 documents, 1 draft</div>
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
        <ContextMenuItem onClick={() => changeSorting("titleSlug", "asc")}>
          {SORT_METHODS.title}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => changeSorting("modifiedAt", "desc")}>
          {SORT_METHODS.modifiedAt}
        </ContextMenuItem>
      </SortingContextMenu>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --padding-x: 12px;
  --padding-y: 20px;

  padding: var(--padding-y) var(--padding-x);

  .MainHeader_MainText {
    color: #f8f8f8;
    font-size: 12px;
    font-weight: bold;

    margin-bottom: 8px;
  }

  .MainHeader_Details {
    color: #cacaca;
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

    color: #7d7d7d;

    :hover {
      color: #cacaca;
    }
  }
`

export default MainHeader
