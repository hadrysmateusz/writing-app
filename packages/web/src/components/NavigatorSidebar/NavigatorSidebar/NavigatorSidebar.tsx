import React, { FC } from "react"
import styled from "styled-components/macro"

import { customScrollbar } from "../../../style-utils"

import { GenericTreeItem, AddButton } from "../../TreeItem"
import { useModal } from "../../Modal"
import { AccountModalContent } from "../../AccountModal"
import { SidebarImportButton } from "../../Importer"

import { SectionContainer } from "../Common"

import { TagsSection } from "../sections/TagsSection"
import { FavoritesSection } from "../sections/FavoritesSection"
import { GroupsSection } from "../sections/GroupsSection"
import { DirectoriesSection } from "../sections/DirectoriesSection"

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

      <DirectoriesSection />

      <TagsSection />

      <SectionContainer>
        <SidebarImportButton />
        <TrashSidebarItem />
      </SectionContainer>
    </Container>
  )
)

const AllDocumentsSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "all")

  return (
    <GenericTreeItem icon="cloud" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>All Documents</div>
      <AddButton groupId={null} />
    </GenericTreeItem>
  )
}

const InboxSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "inbox")

  return (
    <GenericTreeItem icon="inbox" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>Inbox</div>
      <AddButton groupId={null} />
    </GenericTreeItem>
  )
}

const TrashSidebarItem: FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "trash")

  return (
    <GenericTreeItem icon="trash" depth={0} {...getTreeItemProps()}>
      Trash
    </GenericTreeItem>
  )
}

const SettingsSidebarItem: FC<{}> = () => {
  const { open: openAccountModal, Modal: AccountModal } = useModal(false, {})

  return (
    <>
      <GenericTreeItem
        icon="settings"
        onClick={() => openAccountModal({})}
        depth={0}
      >
        Settings
      </GenericTreeItem>
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
