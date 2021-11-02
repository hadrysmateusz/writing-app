import { FC, forwardRef, memo } from "react"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarToggleButton,
  SidebarTab,
} from "../SidebarCommon"
import {
  useViewState,
  PrimarySidebarViews,
  MultiViewSidebar,
} from "../ViewState"
import { Switch, Case } from "../Conditional"

import { Cloud } from "./Cloud"

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
            <PrimarySidebarTabs />

            <Switch value={primarySidebar.currentView}>
              <Case value={PrimarySidebarViews.cloud} component={<Cloud />} />
            </Switch>
          </>
        ) : null}

        <PrimarySidebarToggle sidebar={primarySidebar} />
      </SidebarContainer>
    )
  })
)

export const PrimarySidebarTabs = () => {
  const { primarySidebar, navigatorSidebar } = useViewState()

  const handleClick = (view: PrimarySidebarViews) => () => {
    if (!primarySidebar.isOpen) {
      primarySidebar.open()
    }
    primarySidebar.switchView(view)
  }

  const isTabActive = (view: PrimarySidebarViews) => {
    return primarySidebar.isOpen && primarySidebar.currentView === view
  }

  return (
    <SidebarTabsContainer>
      <SidebarTab
        isActive={isTabActive(PrimarySidebarViews.cloud)}
        onClick={handleClick(PrimarySidebarViews.cloud)}
        icon="cloud"
      />
      <SidebarTab
        isActive={isTabActive(PrimarySidebarViews.local)}
        onClick={handleClick(PrimarySidebarViews.local)}
        icon="folderClosed"
      />
      <SidebarTab
        isActive={isTabActive(PrimarySidebarViews.snippets)}
        onClick={handleClick(PrimarySidebarViews.snippets)}
        icon="clipboard"
      />
      <SidebarTab
        rightSide={true}
        isActive={false}
        icon="sidebarNavigator"
        title="Toggle the navigator sidebar"
        onClick={() => {
          navigatorSidebar.toggle()
        }}
      />
    </SidebarTabsContainer>
  )
}

export const PrimarySidebarToggle: FC<{
  sidebar: MultiViewSidebar<PrimarySidebarViews>
}> = ({ sidebar }) => {
  return (
    <SidebarToggleButton
      leftSide={false}
      isSidebarOpen={sidebar.isOpen}
      onClick={() => {
        sidebar.toggle()
      }}
    />
  )
}
