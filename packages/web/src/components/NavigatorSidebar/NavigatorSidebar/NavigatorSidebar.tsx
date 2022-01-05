import { forwardRef } from "react"

import { GenericTreeItem, AddButton } from "../../TreeItem"
import { SettingsModalContent } from "../../SettingsModal"
import { SidebarImportButton } from "../../Importer"
import { Modal } from "../../Modal"

import { SectionContainer } from "../Common"

import { TagsSection } from "../sections/TagsSection"
import { FavoritesSection } from "../sections/FavoritesSection"
import { GroupsSection } from "../sections/GroupsSection"
import { DirectoriesSection } from "../sections/DirectoriesSection"
import { SearchSection } from "../sections/SearchSection"

import { useNavigationTreeItem } from "./helpers"
import { NavigatorSidebarContainer } from "./NavigatorSidebar.styles"

export const NavigatorSidebar = forwardRef<HTMLDivElement, {}>(
  (_props, ref) => (
    <NavigatorSidebarContainer ref={ref}>
      <SectionContainer>
        <AllDocumentsSidebarItem />
        <InboxSidebarItem />
        <SettingsSidebarItem />
      </SectionContainer>

      <SearchSection />

      <FavoritesSection />

      <GroupsSection />

      <DirectoriesSection />

      <TagsSection />

      <SectionContainer>
        <SidebarImportButton />
        <TrashSidebarItem />
      </SectionContainer>
    </NavigatorSidebarContainer>
  )
)

const AllDocumentsSidebarItem: React.FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "all")

  return (
    <GenericTreeItem icon="cloud" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>All Documents</div>
      <AddButton groupId={null} />
    </GenericTreeItem>
  )
}

const InboxSidebarItem: React.FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "inbox")

  return (
    <GenericTreeItem icon="inbox" depth={0} {...getTreeItemProps()}>
      <div style={{ width: "100%" }}>Inbox</div>
      <AddButton groupId={null} />
    </GenericTreeItem>
  )
}

const TrashSidebarItem: React.FC<{}> = () => {
  const getTreeItemProps = useNavigationTreeItem("cloud", "trash")

  return (
    <GenericTreeItem icon="trash" depth={0} {...getTreeItemProps()}>
      Trash
    </GenericTreeItem>
  )
}

const SettingsSidebarItem: React.FC<{}> = () => {
  const { open: openAccountModal, Modal: AccountModal } = Modal.useModal(
    false,
    {}
  )

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
        {(props) => <SettingsModalContent {...props} />}
      </AccountModal>
    </>
  )
}
