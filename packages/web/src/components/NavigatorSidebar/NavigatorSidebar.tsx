import React from "react"
import styled from "styled-components/macro"

import { VIEWS } from "../../constants"
import { TreeItem, AddButton } from "../TreeItem"
import { useViewState } from "../View/ViewStateProvider"

import { useModal } from "../Modal"
import { AccountModalContent } from "../AccountModal"
import { SidebarImportButton } from "../Importer"
import { FavoritesSection } from "./FavoritesSection"
import { GroupsSection } from "./GroupsSection"
import { SectionContainer } from "./Common"

export const NavigatorSidebar: React.FC = React.memo(() => {
  const { primarySidebar } = useViewState()
  const {
    open: openAccountModal,
    close: closeAccountModal,
    Modal: AccountModal,
  } = useModal(false)

  const { currentView } = primarySidebar

  return (
    <OuterContainer>
      <InnerContainer>
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
      </InnerContainer>

      <AccountModal>
        <AccountModalContent close={closeAccountModal} />
      </AccountModal>
    </OuterContainer>
  )
})

const InnerContainer = styled.div``

const OuterContainer = styled.div`
  --navigator-sidebar-spacing: 20px;

  padding-top: var(--navigator-sidebar-spacing);
  font-size: 12px;
  border-right: 1px solid;
  border-color: #383838;
  background-color: #171717;
  height: 100vh;
  width: 100%;
`
