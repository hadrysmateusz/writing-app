import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { InboxDocumentsList } from "../../DocumentsList"
import { NewButton } from "../NewButton"

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
