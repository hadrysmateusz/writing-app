import React, { forwardRef } from "react"

import { VIEWS } from "../../constants"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarTab,
} from "../SidebarCommon"
import { useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"

import { AllDocumentsView, InboxView, TrashView, GroupView } from "./views"

export const PrimarySidebar = forwardRef<HTMLDivElement, {}>((_props, ref) => {
  const { primarySidebar } = useViewState()

  return (
    <SidebarContainer ref={ref} collapsed={!primarySidebar.isOpen}>
      {primarySidebar.isOpen ? (
        <>
          <SidebarTabsContainer>
            <SidebarTab />
          </SidebarTabsContainer>
          <Switch value={primarySidebar.currentView}>
            <Case value={VIEWS.ALL} component={<AllDocumentsView />} />
            <Case value={VIEWS.INBOX} component={<InboxView />} />
            <Case value={VIEWS.TRASH} component={<TrashView />} />
            <Case default component={<GroupView />} />
          </Switch>
        </>
      ) : null}
    </SidebarContainer>
  )
})
