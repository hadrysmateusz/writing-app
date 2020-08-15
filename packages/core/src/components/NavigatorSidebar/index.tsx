import React, { useMemo } from "react"
import styled from "styled-components/macro"

// TODO: move common components out of the sidebar direcotory
import GroupTreeItem from "../Sidebar/GroupTreeItem"
import { VIEWS } from "../Sidebar/types"
import { TreeItem, AddButton } from "../TreeItem"
import { useMainState } from "../MainProvider"
import { useContextMenu, ContextMenuItem } from "../ContextMenu"
import { useViewState } from "../View/ViewStateProvider"

import createGroupTree from "../../helpers/createGroupTree"
import DocumentTreeItem from "../DocumentTreeItem"
import { useDocumentsAPI, useGroupsAPI } from "../MainProvider"
import { useModal } from "../Modal"
import { AccountModalContent } from "../AccountModal"
import { ImportModalContent } from "../Importer"

export const NavigatorSidebar: React.FC<{}> = () => {
  const { groups, favorites } = useMainState()
  const { createDocument } = useDocumentsAPI()
  const { createGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const {
    open: openAccountModal,
    close: closeAccountModal,
    Modal: AccountModal,
  } = useModal(false)
  const {
    open: openImportModal,
    close: closeImportModal,
    Modal: ImportModal,
  } = useModal(false)

  // map the flat groups list to a tree structure
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  const handleImport = () => {
    openImportModal()
  }

  const handleNewDocument = () => {
    createDocument(null)
  }

  const handleNewGroup = () => {
    createGroup(null)
  }

  const { currentView } = primarySidebar

  return (
    <OuterContainer onContextMenu={openMenu}>
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
        >
          <div style={{ width: "100%" }}>Inbox</div>
          <AddButton groupId={null} />
        </TreeItem>

        <TreeItem icon="settings" onClick={() => openAccountModal()} depth={0}>
          Settings
        </TreeItem>
      </SectionContainer>

      <SectionContainer>
        {favorites.length > 0 && (
          <>
            <SectionHeader>Favorites</SectionHeader>

            {favorites.map((document) => (
              <DocumentTreeItem
                key={document.id}
                depth={0}
                document={document}
                icon="starFilled"
              />
            ))}
          </>
        )}
      </SectionContainer>

      <SectionContainer>
        <SectionHeader>Collections</SectionHeader>

        {groupsTree.map((group) => (
          <GroupTreeItem key={group.id} group={group} depth={1} />
        ))}

        {/* TODO: a nicer, smaller plus icon */}
        <TreeItem icon="plus" onClick={handleNewGroup} depth={1}>
          Add Collection
        </TreeItem>
      </SectionContainer>

      <SectionContainer>
        <TreeItem
          icon="trash"
          onClick={() => primarySidebar.switchView(VIEWS.TRASH)}
          depth={0}
        >
          Trash
        </TreeItem>

        <TreeItem icon="import" onClick={handleImport} depth={0}>
          Import
        </TreeItem>
      </SectionContainer>

      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
        </ContextMenu>
      )}

      <ImportModal>
        <ImportModalContent close={closeImportModal} />
      </ImportModal>

      <AccountModal>
        <AccountModalContent close={closeAccountModal} />
      </AccountModal>
    </OuterContainer>
  )
}

// TODO: work in progress useSubscription hook
// function useSubscription<RxDocumentType, RxQueryResult>(collection: string, queryFactory: any): RxQueryResult {
//   const [value, setValue] = useState<RxQueryResult>()
//   const [isLoading, setIsLoading] = useState(true)

//   const db = useDatabase()

//   useEffect(() => {
//     let sub: Subscription | undefined

//     const setup = async () => {
//       const documentsQuery = queryFactory(db[collection])

//       const newDocuments = await documentsQuery.exec()
//       setValue(newDocuments)
//       setIsLoading(false)

//       sub = documentsQuery.$.subscribe((newDocuments) => {
//         setDocuments(newDocuments)
//       })
//     }

//     setup()

//     return () => {
//       if (sub) {
//         sub.unsubscribe()
//       }
//     }
//   }, [findDocuments])
// }

const SectionContainer = styled.div`
  padding-top: 20px;
`

const OuterContainer = styled.div`
  font-size: 12px;
  border-right: 1px solid;
  border-color: #383838;
  background-color: #171717;
  height: 100vh;
  width: 100%;
`

const SectionHeader = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  color: #a3a3a3;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  /* padding: 16px 20px 5px; */
  padding: 0 18px 5px;

  user-select: none;
`
