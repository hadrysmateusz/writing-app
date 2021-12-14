import { FunctionComponent } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  DocumentsList,
  GoUpMainHeaderButton,
  MainHeader,
  SortingMainHeaderButton,
} from "../../../DocumentsList"
import { useDatabase } from "../../../Database"
import { SIDEBAR_VAR } from "../../../ViewState"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { createFindDeletedDocumentsQuery } from "../queries"
import { useSorting } from "../../../SortingProvider"
import { useDocumentsAPI } from "../../../DocumentsAPIProvider"

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
        buttons={[
          <GoUpMainHeaderButton goUpPath={SIDEBAR_VAR.primary.cloud.all} />,
          <SortingMainHeaderButton />,
        ]}
      />
      <InnerContainer>
        {!isLoading ? <DocumentsList documents={documents || []} /> : null}
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
