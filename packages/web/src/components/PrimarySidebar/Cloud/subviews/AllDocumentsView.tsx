import { useCallback, useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import createGroupTree from "../../../../helpers/createGroupTree"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useDatabase } from "../../../Database"
import { useSorting } from "../../../SortingProvider"
import { useCloudGroupsState } from "../../../CloudGroupsProvider"
import { usePrimarySidebar } from "../../../ViewState"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"

import {
  CloudDocumentsList,
  CloudDocumentsListAndSubGroups,
} from "../SubGroups"
import {
  createFindAllDocumentsQuery,
  createFindDocumentsAtRootQuery,
} from "../queries"

export const AllDocumentsView: React.FC = () => {
  const { documentsListDisplayType } = usePrimarySidebar()

  const renderCorrectList = useCallback(() => {
    switch (documentsListDisplayType) {
      case "flat":
        return <FlatDocumentsList />
      case "tree":
        return <TreeDocumentsList />
      default:
        // TODO: handle this scenario better
        return <TreeDocumentsList />
    }
  }, [documentsListDisplayType])

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="All Documents"
        // numDocuments={documents?.length}
        // numSubgroups={groupsTree.children.length}
        buttons={[
          <MoreMainHeaderButton
            key="sorting"
            contextMenuContent={
              <>
                <CloudDocumentSortingSubmenu />
                <DocumentListDisplayTypeSubmenu />
              </>
            }
          />,
        ]}
      />
      <InnerContainer>{renderCorrectList()}</InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}

const FlatDocumentsList = () => {
  const db = useDatabase()
  const { sorting } = useSorting()
  const { data: documents, isLoading } = useRxSubscription(
    createFindAllDocumentsQuery(db, sorting)
  )
  return !isLoading ? (
    <>
      <CloudDocumentsList documents={documents || []} listType="flat" />
    </>
  ) : null
}

const TreeDocumentsList = () => {
  const db = useDatabase()
  const { sorting } = useSorting()
  const { groups } = useCloudGroupsState()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )
  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  return !isLoading ? (
    <CloudDocumentsListAndSubGroups
      documents={documents || []}
      groups={groupsTree.children}
      listType="tree"
    />
  ) : null
}
