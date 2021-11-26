import React from "react"

import useRxSubscription from "../../../hooks/useRxSubscription"

import { useDatabase } from "../../Database"
import { DocumentsList, MainHeader } from "../../DocumentsList"
import { useMainState } from "../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"

import { NewButton } from "../NewButton"

import { createFindDocumentsAtRootQuery } from "./queries"

export const InboxView: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title="Inbox" />
      <InnerContainer>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
