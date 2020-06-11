import React, { createContext } from "react"
import { useToggleable, Toggleable } from "../hooks"
import { useRequiredContext } from "../hooks/useRequiredContext"

export type ViewState = {
  primarySidebar: Toggleable
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

  return (
    <ViewStateContext.Provider
      value={{ primarySidebar, navigatorSidebar, secondarySidebar }}
    >
      {children}
    </ViewStateContext.Provider>
  )
}
