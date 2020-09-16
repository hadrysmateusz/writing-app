import React, { createContext, useState } from "react"
import { useToggleable, Toggleable } from "../../hooks"
import { useRequiredContext } from "../../hooks/useRequiredContext"
import { VIEWS, SECONDARY_VIEWS } from "../../constants"

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

const PRIMARY_SIDEBAR_CURRENT_VIEW_KEY = "PRIMARY_SIDEBAR_CURRENT_VIEW"
const SECONDARY_SIDEBAR_CURRENT_VIEW_KEY = "SECONDARY_SIDEBAR_CURRENT_VIEW"

const PRIMARY_SIDEBAR_DEFAULT_VIEW = VIEWS.ALL
const SECONDARY_SIDEBAR_DEFAULT_VIEW = SECONDARY_VIEWS.SNIPPETS

const usePrimarySidebar = (initialState: boolean) => {
  const primarySidebar = useToggleable(initialState)
  // TODO: consider moving this state up and generalizing it
  // TODO: store the currentView state between restarts
  const [currentView, setCurrentView] = useState<string>(() => {
    return (
      localStorage.getItem(PRIMARY_SIDEBAR_CURRENT_VIEW_KEY) ??
      PRIMARY_SIDEBAR_DEFAULT_VIEW
    )
  })

  const switchView: SwitchViewFn = (view) => {
    const newView = view || PRIMARY_SIDEBAR_DEFAULT_VIEW

    setCurrentView(newView)
    localStorage.setItem(PRIMARY_SIDEBAR_CURRENT_VIEW_KEY, newView)

    if (!primarySidebar.isOpen) {
      primarySidebar.open()
    }
  }

  return {
    ...primarySidebar,
    currentView,
    switchView,
  }
}

const useSecondarySidebar = (initialState: boolean) => {
  const secondarySidebar = useToggleable(initialState)

  // TODO: consider moving this state up and generalizing it
  // TODO: store the currentView state between restarts
  const [currentView, setCurrentView] = useState<string>(() => {
    return (
      localStorage.getItem(SECONDARY_SIDEBAR_CURRENT_VIEW_KEY) ??
      SECONDARY_SIDEBAR_DEFAULT_VIEW
    )
  })

  const switchView: SwitchViewFn = (view) => {
    const newView = view || SECONDARY_SIDEBAR_DEFAULT_VIEW

    setCurrentView(newView)
    localStorage.setItem(SECONDARY_SIDEBAR_CURRENT_VIEW_KEY, newView)

    if (!secondarySidebar.isOpen) {
      secondarySidebar.open()
    }
  }

  return {
    ...secondarySidebar,
    currentView,
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
