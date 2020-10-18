import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
  NewButton,
} from "../../SidebarCommon"
import { InboxDocumentsList } from "../../DocumentsList"

export const InboxView: React.FC = () => {
  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={null}>
        <InboxDocumentsList />
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
