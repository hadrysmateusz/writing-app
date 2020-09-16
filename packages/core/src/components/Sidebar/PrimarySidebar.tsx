import React from "react"
import styled from "styled-components/macro"

import { useViewState } from "../View/ViewStateProvider"

import { VIEWS } from "../../constants"
import {
  AllDocumentsView,
  InboxView,
  TrashView,
  GroupView,
} from "../PrimarySidebarViews"
import { Switch, Case } from "../Conditional"

export const PrimarySidebar: React.FC<{}> = () => {
  const { primarySidebar } = useViewState()

  return (
    <OuterContainer>
      <Switch value={primarySidebar.currentView}>
        <Case value={VIEWS.ALL} component={<AllDocumentsView />} />
        <Case value={VIEWS.INBOX} component={<InboxView />} />
        <Case value={VIEWS.TRASH} component={<TrashView />} />
        <Case default component={<GroupView />} />
      </Switch>
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  min-height: 0;
  height: 100%;
  border-right: 1px solid;
  border-color: #363636;
  background-color: #1e1e1e;
  position: relative;
`
