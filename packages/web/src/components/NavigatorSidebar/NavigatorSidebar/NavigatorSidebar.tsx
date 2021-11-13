import React, { FC } from "react"
import styled from "styled-components/macro"

import { customScrollbar } from "../../../style-utils"

import { TreeItem, AddButton } from "../../TreeItem"
import { CloudViews } from "../../ViewState"
import { useModal } from "../../Modal"
import { AccountModalContent } from "../../AccountModal"
import { SidebarImportButton } from "../../Importer"

import { FavoritesSection } from "../FavoritesSection"
import { GroupsSection } from "../GroupsSection"
import { SectionContainer } from "../Common"

import { useNavigationTreeItem } from "./helpers"

export const NavigatorSidebar = React.forwardRef<HTMLDivElement, {}>(
  (_props, ref) => (
    <Container ref={ref}>
      <SectionContainer>
        <AllDocumentsSidebarItem />
        <InboxSidebarItem />
        <SettingsSidebarItem />
      </SectionContainer>

      <FavoritesSection />

      <GroupsSection />

      <SectionContainer>
        <SidebarImportButton />
        <TrashSidebarItem />
      </SectionContainer>
    </Container>
  )
)

const AllDocumentsSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem(CloudViews.ALL)

  return (
    <TreeItem icon="cloud" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>All Documents</div>
      <AddButton groupId={null} />
    </TreeItem>
  )
}

const InboxSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem(CloudViews.INBOX)

  return (
    <TreeItem icon="inbox" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>Inbox</div>
      <AddButton groupId={null} />
    </TreeItem>
  )
}

const TrashSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem(CloudViews.ALL)

  return (
    <TreeItem icon="trash" depth={0} {...getTreeItemProps()}>
      Trash
    </TreeItem>
  )
}

const SettingsSidebarItem: FC<{}> = () => {
  const { open: openAccountModal, Modal: AccountModal } = useModal(false, {})

  return (
    <>
      <TreeItem icon="settings" onClick={() => openAccountModal({})} depth={0}>
        Settings
      </TreeItem>
      <AccountModal>
        {(props) => <AccountModalContent {...props} />}
      </AccountModal>
    </>
  )
}

const Container = styled.div`
  --navigator-sidebar-spacing: 20px;

  padding: var(--navigator-sidebar-spacing) 0;
  font-size: 12px;
  height: 100%;
  background: var(--bg-100);

  overflow-y: auto;
  ${customScrollbar}
`
