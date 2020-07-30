import React, { createContext, useState } from "react"
import { useToggleable, Toggleable } from "../../hooks"
import { useRequiredContext } from "../../hooks/useRequiredContext"
import { VIEWS } from "../Sidebar/types"

export type SwitchViewFn = (view: string | null) => void

export type ViewState = {
  primarySidebar: Toggleable & {
    currentView: string
    switchView: SwitchViewFn
  }
  navigatorSidebar: Toggleable
  secondarySidebar: Toggleable
}

const ViewStateContext = createContext<ViewState | null>(null)

export const useViewState = () => {
  return useRequiredContext<ViewState>(
    ViewStateContext,
    "ViewState context is null"
  )
}

const usePrimarySidebar = () => {
  const primarySidebar = useToggleable(true)

  // TODO: consider moving this state up and generalizing it
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

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const primarySidebar = usePrimarySidebar()
  const navigatorSidebar = useToggleable(true)
  const secondarySidebar = useToggleable(false)

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
