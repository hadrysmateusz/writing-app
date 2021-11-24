import { FC, forwardRef, memo } from "react"

import {
  SidebarContainer,
  SidebarTabsContainer,
  SidebarToggleButton,
  SidebarTab,
} from "../SidebarCommon"
import {
  MultiViewSidebar,
  SidebarView,
  usePrimarySidebar,
  useNavigatorSidebar,
} from "../ViewState"
import { Switch, Case } from "../Conditional"

import { Cloud } from "./Cloud"
import { Tags } from "./Tags"

/**
 * memo is used to prevent huge amounts of rerenders when resizing the sidebar
 */
export const PrimarySidebar = memo(
  forwardRef<HTMLDivElement, {}>((_props, ref) => {
    const primarySidebar = usePrimarySidebar()

    return (
      <SidebarContainer ref={ref} collapsed={!primarySidebar.isOpen}>
        {primarySidebar.isOpen ? (
          <>
            <PrimarySidebarTabs />

            <Switch value={primarySidebar.currentView}>
              <Case value={"cloud"} component={<Cloud />} />
              <Case value={"tags"} component={<Tags />} />
            </Switch>
          </>
        ) : null}

        <PrimarySidebarToggle sidebar={primarySidebar} />
      </SidebarContainer>
    )
  })
)

export const PrimarySidebarTabs = () => {
  const primarySidebar = usePrimarySidebar()
  const navigatorSidebar = useNavigatorSidebar()

  const handleClick = (view: SidebarView<"primary">) => () => {
    if (primarySidebar.currentView === view && primarySidebar.isOpen) {
      primarySidebar.close()
    } else {
      primarySidebar.open()
      primarySidebar.switchView(view)
    }
  }

  const isTabActive = (view: SidebarView<"primary">) => {
    return primarySidebar.isOpen && primarySidebar.currentView === view
  }

  return (
    <SidebarTabsContainer>
      <SidebarTab
        isActive={isTabActive("cloud")}
        onClick={handleClick("cloud")}
        icon="cloud"
      />
      <SidebarTab
        isActive={isTabActive("local")}
        onClick={handleClick("local")}
        icon="folderClosed"
      />
      {/* <SidebarTab
        isActive={isTabActive("snippets")}
        onClick={handleClick("snippets")}
        icon="clipboard"
      /> */}
      <SidebarTab
        isActive={isTabActive("tags")}
        onClick={handleClick("tags")}
        icon="tag"
      />
      {primarySidebar.isOpen ? (
        <SidebarTab
          rightSide={true}
          isActive={false}
          icon="sidebarNavigator"
          title="Toggle the navigator sidebar"
          onClick={() => {
            navigatorSidebar.toggle()
          }}
        />
      ) : null}
    </SidebarTabsContainer>
  )
}

export const PrimarySidebarToggle: FC<{
  sidebar: MultiViewSidebar<"primary">
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
