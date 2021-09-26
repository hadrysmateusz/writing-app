import React, { useCallback, useMemo } from "react"

import { useStatelessToggleable, Toggleable } from "../../hooks"
import { createContext } from "../../utils"

import { useLocalSettings } from "../LocalSettings"
import defaultLocalSettings from "../LocalSettings/default"

import { ViewState, SwitchViewFn, SidebarID, Side } from "./types"

export const [ViewStateContext, useViewState] = createContext<ViewState>()

// TODO: remove this, replace with custom methods for each sidebar
const useSidebarView = (
  settingName: "secondarySidebarCurrentView" | "primarySidebarCurrentView",
  toggleable: Toggleable<undefined>
): [string, SwitchViewFn] => {
  const { updateLocalSetting, ...localSettings } = useLocalSettings()

  const currentView = localSettings[settingName]

  const switchView: SwitchViewFn = (view) => {
    const newView = view || defaultLocalSettings.secondarySidebarCurrentView

    updateLocalSetting("secondarySidebarCurrentView", newView)

    if (!currentView) {
      toggleable.open()
    }
  }

  return [currentView, switchView]
}

const useSidebarToggleable = (
  settingName:
    | "primarySidebarIsOpen"
    | "secondarySidebarIsOpen"
    | "navigatorSidebarIsOpen"
) => {
  const { updateLocalSetting, ...localSettings } = useLocalSettings()

  const isOpen = localSettings[settingName]

  const onChange = useCallback(
    (value: boolean) => {
      updateLocalSetting(settingName, value)
    },
    [settingName, updateLocalSetting]
  )

  const sidebarMethods = useStatelessToggleable(isOpen, onChange)

  return { ...sidebarMethods, isOpen }
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const navigatorToggleable = useSidebarToggleable("navigatorSidebarIsOpen")
  const primaryToggleable = useSidebarToggleable("primarySidebarIsOpen")
  const secondaryToggleable = useSidebarToggleable("secondarySidebarIsOpen")

  const {
    updateLocalSetting,
    primarySidebarCurrentSubviews,
    primarySidebarCurrentView,
  } = useLocalSettings()

  const switchPrimaryView = useCallback(
    (view: string) => {
      const newView = view || defaultLocalSettings.primarySidebarCurrentView

      updateLocalSetting("primarySidebarCurrentView", newView)

      if (!primarySidebarCurrentView) {
        primaryToggleable.open()
      }
    },
    [primarySidebarCurrentView, primaryToggleable, updateLocalSetting]
  )

  const switchPrimarySubview = useCallback(
    (view: string, subview: string) => {
      updateLocalSetting("primarySidebarCurrentSubviews", {
        ...primarySidebarCurrentSubviews,
        [view]: subview,
      })
      switchPrimaryView(view)
    },
    [primarySidebarCurrentSubviews, switchPrimaryView, updateLocalSetting]
  )

  // TODO: create a view switch wrapper for primary sidebar that can handle both views, and subviews

  const [
    secondarySidebarCurrentView,
    switchSecondarySidebarView,
  ] = useSidebarView("secondarySidebarCurrentView", secondaryToggleable)

  const primarySidebar = useMemo(
    () => ({
      ...primaryToggleable,
      id: SidebarID.primary,
      side: Side.left,
      minWidth: 180,
      maxWidth: 400,
      currentView: primarySidebarCurrentView,
      currentSubviews: primarySidebarCurrentSubviews,
      switchView: switchPrimaryView,
      switchSubview: switchPrimarySubview,
    }),
    [
      primarySidebarCurrentSubviews,
      primarySidebarCurrentView,
      primaryToggleable,
      switchPrimarySubview,
      switchPrimaryView,
    ]
  )

  const secondarySidebar = useMemo(
    () => ({
      ...secondaryToggleable,
      id: SidebarID.secondary,
      side: Side.right,
      minWidth: 180,
      maxWidth: 400,
      currentView: secondarySidebarCurrentView,
      switchView: switchSecondarySidebarView,
    }),
    [
      secondarySidebarCurrentView,
      secondaryToggleable,
      switchSecondarySidebarView,
    ]
  )

  const navigatorSidebar = useMemo(
    () => ({
      ...navigatorToggleable,
      id: SidebarID.navigator,
      side: Side.left,
      minWidth: 150,
      maxWidth: 300,
    }),
    [navigatorToggleable]
  )

  return (
    <ViewStateContext.Provider
      value={{
        navigatorSidebar,
        primarySidebar,
        secondarySidebar,
      }}
    >
      {children}
    </ViewStateContext.Provider>
  )
}
