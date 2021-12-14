import React from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import { useDatabase } from "../../../Database"
import {
  DocumentsList,
  GoUpMainHeaderButton,
  MainHeader,
  SortingMainHeaderButton,
} from "../../../DocumentsList"
import { useMainState } from "../../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { SIDEBAR_VAR } from "../../../ViewState"

import { NewButton } from "../../NewButton"

import { createFindDocumentsAtRootQuery } from "../queries"

export const InboxView: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Inbox"
        buttons={[
          <GoUpMainHeaderButton goUpPath={SIDEBAR_VAR.primary.cloud.all} />,
          <SortingMainHeaderButton />,
        ]}
      />
      <InnerContainer>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
