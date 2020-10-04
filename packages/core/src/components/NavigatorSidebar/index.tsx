import React, { useCallback } from "react"
import styled from "styled-components/macro"

import { VIEWS } from "../../constants"
import { TreeItem, AddButton } from "../TreeItem"
import { useContextMenu } from "../ContextMenu"
import { useViewState } from "../View/ViewStateProvider"

import { useModal } from "../Modal"
import { AccountModalContent } from "../AccountModal"
import { SidebarImportButton } from "../Importer"
import { FavoritesSection } from "./FavoritesSection"
import { GroupsSection } from "./GroupsSection"
import { SectionContainer } from "./Common"

export const NavigatorSidebar: React.FC = React.memo(() => {
  const { primarySidebar } = useViewState()
  const { openMenu } = useContextMenu()
  const {
    open: openAccountModal,
    close: closeAccountModal,
    Modal: AccountModal,
  } = useModal(false)

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        openMenu(event)
      }
    },
    [openMenu]
  )

  const { currentView } = primarySidebar

  return (
    <OuterContainer onContextMenu={handleContextMenu}>
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
