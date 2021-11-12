import React from "react"

import useRxSubscription from "../../../hooks/useRxSubscription"

import { useDatabase } from "../../Database"
import { useMainState } from "../../MainProvider"
import { DocumentsList, MainHeader } from "../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"

import { NewButton } from "../NewButton"

export const AllDocumentsView: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    db.documents.findNotRemoved().sort({ [sorting.index]: sorting.direction })
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title="All Documents" />
      <InnerContainer groupId={null}>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
