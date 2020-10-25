import React, { forwardRef, memo } from "react"

import { SECONDARY_VIEWS } from "../../constants"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarToggle,
} from "../SidebarCommon"
import { useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"

import { DashboardView } from "./views"

/**
 * memo is used to prevent huge amounts of rerenders when resizing the sidebar
 */
export const SecondarySidebar = memo(
  forwardRef<HTMLDivElement, {}>((_props, ref) => {
    const { secondarySidebar } = useViewState()

    return (
      <SidebarContainer ref={ref} collapsed={!secondarySidebar.isOpen}>
        {secondarySidebar.isOpen ? (
          <>
            <SidebarTabsContainer>{/* <SidebarTab /> */}</SidebarTabsContainer>

            <Switch value={secondarySidebar.currentView}>
              <Case
                value={SECONDARY_VIEWS.SNIPPETS}
                component={<DashboardView />}
              />
              {/* TODO: better handle the default case */}
              <Case default component={<div />} />
            </Switch>
          </>
        ) : null}

        <SidebarToggle sidebar={secondarySidebar} />
      </SidebarContainer>
    )
  })
)
