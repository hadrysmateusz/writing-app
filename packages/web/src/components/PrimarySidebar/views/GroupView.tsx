import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { GroupDocumentsList } from "../../DocumentsList"
import { useViewState } from "../../ViewState"
import { NewButton } from "../NewButton"

export const GroupView: React.FC = () => {
  const { primarySidebar } = useViewState()

  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={primarySidebar.currentView}>
        <GroupDocumentsList groupId={primarySidebar.currentSubviews.cloud} />
      </InnerContainer>
      <NewButton groupId={primarySidebar.currentSubviews.cloud} />
    </PrimarySidebarViewContainer>
  )
}
