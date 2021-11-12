import { FunctionComponent } from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { DocumentsList, MainHeader } from "../../DocumentsList"
import { useDocumentsAPI, useMainState } from "../../MainProvider"
import { PrimarySidebarBottomButton } from "../PrimarySidebarBottomButton"
import useRxSubscription from "../../../hooks/useRxSubscription"
import { useDatabase } from "../../Database"

export const TrashView: FunctionComponent = () => {
  const db = useDatabase()
  const { sorting } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    db.documents
      .find()
      .where("isDeleted")
      .eq(true)
      .sort({ [sorting.index]: sorting.direction })
  )

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title="Trash" />
      <InnerContainer groupId={undefined}>
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
