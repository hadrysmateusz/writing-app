import {
  useMemo,
  useState,
  createContext,
  useContext,
  useEffect,
  FC,
} from "react"

import { defaultLocalSettings, useLocalSettings } from "../LocalSettings"

import { useSidebarToggleable } from "./useSidebarToggleable"
import { SidebarID, Side, NavigatorSidebar } from "./types"
import { SidebarsLoadingAction } from "./ViewStateProvider"

type NavigatorSidebarContextValue = NavigatorSidebar

const NavigatorSidebarContext = createContext<
  NavigatorSidebarContextValue | undefined
>(undefined)

export const NavigatorSidebarProvider: FC<{
  loadingStateDispatch: React.Dispatch<SidebarsLoadingAction>
}> = ({ children, loadingStateDispatch }) => {
  const { getLocalSetting } = useLocalSettings()

  const toggleable = useSidebarToggleable("navigator")

  // TODO: probably just move it to navigator sidebar or even the groups section itself
  const [expandedKeys, setExpandedKeys] = useState(
    defaultLocalSettings.expandedKeys
  )

  useEffect(() => {
    ;(async () => {
      const expandedKeys = await getLocalSetting("expandedKeys")
      setExpandedKeys(expandedKeys)
      loadingStateDispatch({ type: "sidebar-ready", sidebarId: "navigator" })
    })()
  }, [getLocalSetting, loadingStateDispatch])

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
