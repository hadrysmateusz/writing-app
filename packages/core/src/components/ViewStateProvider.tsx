import React, { createContext, useState } from "react"
import { useToggleable, Toggleable } from "../hooks"
import { useRequiredContext } from "../hooks/useRequiredContext"
import { VIEWS } from "./Sidebar/types"

export type ViewState = {
  primarySidebar: Toggleable & {
    currentView: string
    switchView: (view: string) => void
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

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const primarySidebar = useToggleable(true)
  const navigatorSidebar = useToggleable(true)
  const secondarySidebar = useToggleable(false)

  // TODO: move this into a separate hook for the primarySidebar once more state needs to be handled here
  // TODO: consider making the all view be null
  const [currentView, setCurrentView] = useState<string>(VIEWS.ALL)

  const switchView = (view: string) => {
    setCurrentView(view)
    if (!primarySidebar.isOpen) {
      primarySidebar.open()
    }
  }

  return (
    <ViewStateContext.Provider
      value={{
        primarySidebar: {
          ...primarySidebar,
          currentView,
          switchView,
        },
        navigatorSidebar,
        secondarySidebar,
      }}
    >
      {children}
    </ViewStateContext.Provider>
  )
}
