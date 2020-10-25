import React, { forwardRef, memo } from "react"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarTab,
  SidebarToggle,
} from "../SidebarCommon"
import { useViewState, PrimarySidebarViews } from "../ViewState"
import { Switch, Case } from "../Conditional"

import { Cloud } from "./Cloud"
import Icon from "../Icon"

/**
 * memo is used to prevent huge amounts of rerenders when resizing the sidebar
 */
export const PrimarySidebar = memo(
  forwardRef<HTMLDivElement, {}>((_props, ref) => {
    const { primarySidebar } = useViewState()

    return (
      <SidebarContainer ref={ref} collapsed={!primarySidebar.isOpen}>
        {primarySidebar.isOpen ? (
          <>
            <SidebarTabsContainer>
              <SidebarTab
                isActive={
                  primarySidebar.currentView === PrimarySidebarViews.cloud
                }
                onClick={() => {
                  primarySidebar.switchView(PrimarySidebarViews.cloud)
                }}
              >
                <Icon icon="cloud" />
              </SidebarTab>
              <SidebarTab
                isActive={
                  primarySidebar.currentView === PrimarySidebarViews.local
                }
                onClick={() => {
                  primarySidebar.switchView(PrimarySidebarViews.local)
                }}
              >
                <Icon icon="folderClosed" />
              </SidebarTab>
              <SidebarTab
                isActive={
                  primarySidebar.currentView === PrimarySidebarViews.snippets
                }
                onClick={() => {
                  primarySidebar.switchView(PrimarySidebarViews.snippets)
                }}
              >
                <Icon icon="clipboard" />
              </SidebarTab>
            </SidebarTabsContainer>

            <Switch value={primarySidebar.currentView}>
              <Case value={PrimarySidebarViews.cloud} component={<Cloud />} />
            </Switch>
          </>
        ) : null}

        <SidebarToggle sidebar={primarySidebar} />
      </SidebarContainer>
    )
  })
)
