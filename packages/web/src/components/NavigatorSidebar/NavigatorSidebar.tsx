import React from "react"
import styled from "styled-components/macro"

import { VIEWS } from "../../constants"
import { TreeItem, AddButton } from "../TreeItem"
import { useViewState } from "../ViewState"

import { useModal } from "../Modal"
import { AccountModalContent } from "../AccountModal"
import { SidebarImportButton } from "../Importer"
import { FavoritesSection } from "./FavoritesSection"
import { GroupsSection } from "./GroupsSection"
import { SectionContainer } from "./Common"

export const NavigatorSidebar = React.forwardRef<HTMLDivElement, {}>(
  (_props, ref) => {
    const { primarySidebar } = useViewState()
    const {
      open: openAccountModal,
      close: closeAccountModal,
      Modal: AccountModal,
    } = useModal(false)

    const { currentView } = primarySidebar

    return (
      <>
        <Container ref={ref}>
          <SectionContainer>
            <TreeItem
              icon="cloud"
              onClick={() => primarySidebar.switchView(VIEWS.ALL)}
              depth={0}
              isActive={currentView === VIEWS.ALL}
            >
              <div style={{ width: "100%" }}>All Documents</div>
              <AddButton groupId={null} />
            </TreeItem>

            <TreeItem
              icon="inbox"
              onClick={() => primarySidebar.switchView(VIEWS.INBOX)}
              depth={0}
              isActive={currentView === VIEWS.INBOX}
            >
              <div style={{ width: "100%" }}>Inbox</div>
              <AddButton groupId={null} />
            </TreeItem>

            <TreeItem
              icon="settings"
              onClick={() => openAccountModal()}
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
              onClick={() => primarySidebar.switchView(VIEWS.TRASH)}
              depth={0}
              isActive={currentView === VIEWS.TRASH}
            >
              Trash
            </TreeItem>
          </SectionContainer>
        </Container>

        <AccountModal>
          <AccountModalContent close={closeAccountModal} />
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
  /* max-width: 16.66666vw; */
`
