import React, { createContext, useState } from "react"
import { useToggleable, Toggleable } from "../../hooks"
import { useRequiredContext } from "../../hooks/useRequiredContext"
import { VIEWS, SECONDARY_VIEWS } from "../Sidebar/types"

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

const usePrimarySidebar = (initialState: boolean) => {
  const primarySidebar = useToggleable(initialState)

  // TODO: consider moving this state up and generalizing it
  // TODO: store the currentView state between restarts
  const [currentView, setCurrentView] = useState<string>(VIEWS.ALL)

  const switchView: SwitchViewFn = (view) => {
    setCurrentView(view || VIEWS.ALL)
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
  const [currentView, setCurrentView] = useState<string>(
    SECONDARY_VIEWS.SNIPPETS
  )

  const switchView: SwitchViewFn = (view) => {
    setCurrentView(view || SECONDARY_VIEWS.SNIPPETS)
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
