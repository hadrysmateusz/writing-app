import React, { useCallback, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"

import { LocalSettings } from "../Database"
import { SecondarySidebar, SidebarView, SidebarID, Side } from "./types"
import { useSidebarToggleable } from "./helpers"

type SecondarySidebarContextValue = SecondarySidebar

const SecondarySidebarContext = React.createContext<
  SecondarySidebarContextValue | undefined
>(undefined)

export const SecondarySidebarProvider = ({ children }) => {
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  const toggleable = useSidebarToggleable("secondary")

  const [
    secondarySidebarCurrentView,
    setSecondarySidebarCurrentView,
  ] = useState(defaultLocalSettings.sidebars.secondary.currentView)

  // TODO: create a view switch wrapper for primary sidebar that can handle both views, and subviews

  const switchSecondaryView = useCallback(
    async (view: SidebarView<"secondary">) => {
      setSecondarySidebarCurrentView(view)

      if (!toggleable.isOpen) {
        toggleable.open()
      }

      // TODO: remove duplication (probably by reworking updateLocalSetting method)
      const sidebarsSetting = await getLocalSetting("sidebars")

      const newSideabarsValue: LocalSettings["sidebars"] = {
        ...sidebarsSetting,
        secondary: {
          ...sidebarsSetting["secondary"],
          currentView: view,
        },
      }

      await updateLocalSetting("sidebars", newSideabarsValue)
      return
    },
    [getLocalSetting, toggleable, updateLocalSetting]
  )

  const value = useMemo(
    () => ({
      ...toggleable,
      id: SidebarID.secondary,
      side: Side.right,
      minWidth: 180,
      maxWidth: 400,
      currentView: secondarySidebarCurrentView,
      switchView: switchSecondaryView,
    }),
    [secondarySidebarCurrentView, switchSecondaryView, toggleable]
  )
  return (
    <SecondarySidebarContext.Provider value={value}>
      {children}
    </SecondarySidebarContext.Provider>
  )
}

export const useSecondarySidebar = () => {
  const context = React.useContext(SecondarySidebarContext)
  if (!context) {
    throw new Error(
      "useSecondarySidebar must be used within SecondarySidebarProvider"
    )
  }
  return context
}
