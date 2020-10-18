import React, { forwardRef } from "react"

import { SECONDARY_VIEWS } from "../../constants"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarTab,
} from "../SidebarCommon"
import { useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"

import { DashboardView } from "./views"

export const SecondarySidebar = forwardRef<HTMLDivElement, {}>(
  (_props, ref) => {
    const { secondarySidebar } = useViewState()

    return (
      <SidebarContainer ref={ref} collapsed={!secondarySidebar.isOpen}>
        {secondarySidebar.isOpen ? (
          <>
            <SidebarTabsContainer>
              <SidebarTab />
            </SidebarTabsContainer>
            <Switch value={secondarySidebar.currentView}>
              <Case
                value={SECONDARY_VIEWS.SNIPPETS}
                component={<DashboardView />}
              />
              <Case default component={<div />} />
              {/* TODO: better handle this */}
            </Switch>
          </>
        ) : null}
      </SidebarContainer>
    )
  }
)
