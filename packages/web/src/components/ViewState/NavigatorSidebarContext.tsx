import { useMemo, useState, createContext, useContext } from "react"

import { defaultLocalSettings } from "../LocalSettings"

import { useSidebarToggleable } from "./helpers"
import { SidebarID, Side, NavigatorSidebar } from "./types"

type NavigatorSidebarContextValue = NavigatorSidebar

const NavigatorSidebarContext = createContext<
  NavigatorSidebarContextValue | undefined
>(undefined)

export const NavigatorSidebarProvider = ({ children }) => {
  const toggleable = useSidebarToggleable("navigator")

  // TODO: probably just move it to navigator sidebar or even the groups section itself
  const [expandedKeys, setExpandedKeys] = useState(
    defaultLocalSettings.expandedKeys
  )

  const value = useMemo(
    () => ({
      ...toggleable,
      id: SidebarID.navigator,
      side: Side.left,
      minWidth: 150,
      maxWidth: 300,
      expandedKeys,
      setExpandedKeys,
    }),
    [expandedKeys, toggleable]
  )

  return (
    <NavigatorSidebarContext.Provider value={value}>
      {children}
    </NavigatorSidebarContext.Provider>
  )
}

export const useNavigatorSidebar = () => {
  const context = useContext(NavigatorSidebarContext)
  if (!context) {
    throw new Error(
      "useNavigatorSidebar must be used within NavigatorSidebarProvider"
    )
  }
  return context
}
