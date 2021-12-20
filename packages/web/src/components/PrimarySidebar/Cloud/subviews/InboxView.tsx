import React from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import { useDatabase } from "../../../Database"
import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useSorting } from "../../../SortingProvider"
import { SIDEBAR_VAR } from "../../../ViewState"

import { NewButton } from "../../NewButton"

import { createFindDocumentsAtRootQuery } from "../queries"
import { CloudDocumentsList } from "../SubGroups"

export const InboxView: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useSorting()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Inbox"
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
        {!isLoading ? <CloudDocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
