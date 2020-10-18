import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
  NewButton,
} from "../../SidebarCommon"
import { AllDocumentsList } from "../../DocumentsList"

export const AllDocumentsView: React.FC = () => {
  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={null}>
        <AllDocumentsList />
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
