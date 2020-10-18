import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
  NewButton,
} from "../../SidebarCommon"
import { GroupDocumentsList } from "../../DocumentsList"
import { useViewState } from "../../ViewState"

export const GroupView: React.FC = () => {
  const { primarySidebar } = useViewState()

  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={primarySidebar.currentView}>
        <GroupDocumentsList groupId={primarySidebar.currentView} />
      </InnerContainer>
      <NewButton groupId={primarySidebar.currentView} />
    </PrimarySidebarViewContainer>
  )
}
