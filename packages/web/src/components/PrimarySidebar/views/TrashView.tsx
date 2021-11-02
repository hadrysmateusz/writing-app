import { FunctionComponent } from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { TrashDocumentsList } from "../../DocumentsList"
import { useDocumentsAPI } from "../../MainProvider"
import { PrimarySidebarBottomButton } from "../PrimarySidebarBottomButton"

export const TrashView: FunctionComponent = () => {
  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={undefined}>
        <TrashDocumentsList />
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
