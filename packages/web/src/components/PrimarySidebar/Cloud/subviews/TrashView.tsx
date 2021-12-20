import { FunctionComponent } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useDatabase } from "../../../Database"
import { SIDEBAR_VAR } from "../../../ViewState"
import { useSorting } from "../../../SortingProvider"
import { useDocumentsAPI } from "../../../CloudDocumentsProvider"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { createFindDeletedDocumentsQuery } from "../queries"
import { CloudDocumentsList } from "../SubGroups"

export const TrashView: FunctionComponent = () => {
  const db = useDatabase()
  const { sorting } = useSorting()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDeletedDocumentsQuery(db, sorting)
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Trash"
        numDocuments={documents?.length}
        buttons={[
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.cloud.all}
            key={SIDEBAR_VAR.primary.cloud.all}
          />,
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
      <InnerContainer>
        {!isLoading ? (
          <CloudDocumentsList documents={documents || []} listType="flat" />
        ) : null}
      </InnerContainer>
      <DeleteAllButton />
    </PrimarySidebarViewContainer>
  )
}

const DeleteAllButton: FunctionComponent = () => {
  const { permanentlyRemoveAllDocuments } = useDocumentsAPI()

  return (
    <PrimarySidebarBottomButton
      icon="trash"
      handleClick={() => permanentlyRemoveAllDocuments()}
    >
      Empty Trash
    </PrimarySidebarBottomButton>
  )
}
