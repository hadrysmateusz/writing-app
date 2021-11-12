import React from "react"
import styled from "styled-components/macro"

import { TreeItem, AddButton } from "../TreeItem"
import { useViewState, PrimarySidebarViews, CloudViews } from "../ViewState"
import { useModal } from "../Modal"
import { AccountModalContent } from "../AccountModal"
import { SidebarImportButton } from "../Importer"
import { FavoritesSection } from "./FavoritesSection"
import { GroupsSection } from "./GroupsSection"
import { SectionContainer } from "./Common"
import { customScrollbar } from "../../style-utils"

export const NavigatorSidebar = React.forwardRef<HTMLDivElement, {}>(
  (_props, ref) => {
    const { primarySidebar } = useViewState()
    const { open: openAccountModal, Modal: AccountModal } = useModal(false, {})

    const { currentView, currentSubviews } = primarySidebar

    return (
      <>
        <Container ref={ref}>
          <SectionContainer>
            <TreeItem
              icon="cloud"
              onClick={() =>
                primarySidebar.switchSubview(
                  PrimarySidebarViews.cloud,
                  CloudViews.ALL
                )
              }
              depth={0}
              isActive={currentSubviews[currentView] === CloudViews.ALL}
            >
              <div style={{ width: "100%" }}>All Documents</div>
              <AddButton groupId={null} />
            </TreeItem>

            <TreeItem
              icon="inbox"
              onClick={() =>
                primarySidebar.switchSubview(
                  PrimarySidebarViews.cloud,
                  CloudViews.INBOX
                )
              }
              depth={0}
              isActive={currentSubviews[currentView] === CloudViews.INBOX}
            >
              <div style={{ width: "100%" }}>Inbox</div>
              <AddButton groupId={null} />
            </TreeItem>

            <TreeItem
              icon="settings"
              onClick={() => openAccountModal({})}
              depth={0}
            >
              Settings
            </TreeItem>
          </SectionContainer>

          <FavoritesSection />

          <GroupsSection />

          <SectionContainer>
            <SidebarImportButton />

            <TreeItem
              icon="trash"
              onClick={() =>
                primarySidebar.switchSubview(
                  PrimarySidebarViews.cloud,
                  CloudViews.TRASH
                )
              }
              depth={0}
              isActive={currentSubviews[currentView] === CloudViews.TRASH}
            >
              Trash
            </TreeItem>
          </SectionContainer>
        </Container>

        <AccountModal>
          {(props) => <AccountModalContent {...props} />}
        </AccountModal>
      </>
    )
  }
)

const Container = styled.div`
  --navigator-sidebar-spacing: 20px;

  padding: var(--navigator-sidebar-spacing) 0;
  font-size: 12px;
  height: 100%;
  background: var(--bg-100);

  overflow-y: auto;
  ${customScrollbar}
`
