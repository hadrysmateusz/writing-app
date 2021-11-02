import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { AllDocumentsList } from "../../DocumentsList"
import { NewButton } from "../NewButton"

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
