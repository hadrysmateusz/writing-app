import React from "react"

import useRxSubscription from "../../../hooks/useRxSubscription"

import { DocumentsList, MainHeader } from "../../DocumentsList"
import { useDocumentsAPI, useMainState } from "../../MainProvider"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"

import { NewButton } from "../NewButton"

export const InboxView: React.FC = () => {
  const { findDocuments } = useDocumentsAPI()
  const { sorting } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    findDocuments(false)
      .where("parentGroup")
      .eq(null)
      .sort({ [sorting.index]: sorting.direction })
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title="Inbox" />
      <InnerContainer groupId={null}>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
