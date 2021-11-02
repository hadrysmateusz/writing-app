import { FC, forwardRef, memo } from "react"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarTab,
  SidebarToggleButton,
} from "../SidebarCommon"
import {
  MultiViewSidebar,
  SecondarySidebarViews,
  useViewState,
} from "../ViewState"
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
            <SecondarySidebarTabs />

            <Switch value={secondarySidebar.currentView}>
              <Case
                value={SecondarySidebarViews.stats}
                component={<DashboardView />}
              />
            </Switch>
          </>
        ) : null}

        <SecondarySidebarToggle sidebar={secondarySidebar} />
      </SidebarContainer>
    )
  })
)

export const SecondarySidebarTabs = () => {
  const { secondarySidebar } = useViewState()

  const handleClick = (view: SecondarySidebarViews) => () => {
    if (secondarySidebar.currentView === view && secondarySidebar.isOpen) {
      secondarySidebar.close()
    } else {
      secondarySidebar.open()
      secondarySidebar.switchView(view)
    }
  }

  const isTabActive = (view: SecondarySidebarViews) => {
    return secondarySidebar.isOpen && secondarySidebar.currentView === view
  }

  return (
    <SidebarTabsContainer>
      <SidebarTab
        isActive={isTabActive(SecondarySidebarViews.stats)}
        onClick={handleClick(SecondarySidebarViews.stats)}
        icon="stats"
      />
    </SidebarTabsContainer>
  )
}

export const SecondarySidebarToggle: FC<{
  sidebar: MultiViewSidebar<SecondarySidebarViews>
}> = ({ sidebar }) => {
  return (
    <SidebarToggleButton
      leftSide={true}
      isSidebarOpen={sidebar.isOpen}
      onClick={() => {
        sidebar.toggle()
      }}
    />
  )
}
