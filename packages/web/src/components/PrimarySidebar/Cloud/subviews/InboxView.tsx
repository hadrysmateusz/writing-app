import React from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import { useDatabase } from "../../../Database"
import {
  DocumentsList,
  GoUpMainHeaderButton,
  MainHeader,
  SortingMainHeaderButton,
} from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useSorting } from "../../../SortingProvider"
import { SIDEBAR_VAR } from "../../../ViewState"

import { NewButton } from "../../NewButton"

import { createFindDocumentsAtRootQuery } from "../queries"

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
        buttons={[
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.cloud.all}
            key={SIDEBAR_VAR.primary.cloud.all}
          />,
          <SortingMainHeaderButton key="sorting" />,
        ]}
      />
      <InnerContainer>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
