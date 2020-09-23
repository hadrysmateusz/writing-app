import React, { createContext } from "react"
import { useToggleable, Toggleable } from "../../hooks"
import { useRequiredContext } from "../../hooks/useRequiredContext"
import { useLocalSettings } from "../LocalSettings"
import defaultLocalSettings from "../LocalSettings/default"

export type SwitchViewFn = (view: string | null) => void

export type MultiViewSidebar = Toggleable & {
  currentView: string
  switchView: SwitchViewFn
}

export type ViewState = {
  primarySidebar: MultiViewSidebar
  secondarySidebar: MultiViewSidebar
  navigatorSidebar: Toggleable
}

const ViewStateContext = createContext<ViewState | null>(null)

export const useViewState = () => {
  return useRequiredContext<ViewState>(
    ViewStateContext,
    "ViewState context is null"
  )
}

// TODO: save open state of sidebars
// const NAVIGATOR_SIDEBAR_IS_OPEN_KEY = "NAVIGATOR_SIDEBAR_IS_OPEN"
// const PRIMARY_SIDEBAR_IS_OPEN_KEY = "PRIMARY_SIDEBAR_IS_OPEN"
// const SECONDARY_SIDEBAR_IS_OPEN_KEY = "SECONDARY_SIDEBAR_IS_OPEN"

const usePrimarySidebar = (initialState: boolean) => {
  const primarySidebar = useToggleable(initialState)
  const { updateLocalSetting, primarySidebarCurrentView } = useLocalSettings()

  const switchView: SwitchViewFn = (view) => {
    const newView = view || defaultLocalSettings.primarySidebarCurrentView

    updateLocalSetting("primarySidebarCurrentView", newView)

    if (!primarySidebar.isOpen) {
      primarySidebar.open()
    }
  }

  return {
    ...primarySidebar,
    currentView: primarySidebarCurrentView,
    switchView,
  }
}

const useSecondarySidebar = (initialState: boolean) => {
  const secondarySidebar = useToggleable(initialState)
  const { updateLocalSetting, secondarySidebarCurrentView } = useLocalSettings()

  const switchView: SwitchViewFn = (view) => {
    const newView = view || defaultLocalSettings.secondarySidebarCurrentView

    updateLocalSetting("secondarySidebarCurrentView", newView)

    if (!secondarySidebar.isOpen) {
      secondarySidebar.open()
    }
  }

  return {
    ...secondarySidebar,
    currentView: secondarySidebarCurrentView,
    switchView,
  }
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  // TODO: store the toggled state between restarts
  const primarySidebar = usePrimarySidebar(true)
  const secondarySidebar = useSecondarySidebar(false)
  const navigatorSidebar = useToggleable(true)

  return (
    <ViewStateContext.Provider
      value={{
        primarySidebar,
        navigatorSidebar,
        secondarySidebar,
      }}
    >
      {children}
    </ViewStateContext.Provider>
  )
}
