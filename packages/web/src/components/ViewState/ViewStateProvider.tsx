import React, { FC, useCallback, useEffect, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"

import { ToggleableHooks, useStatelessToggleable } from "../../hooks"
import { createContext } from "../../utils"

import {
  PrimarySidebarSubview,
  PrimarySidebarSubviews,
  PrimarySidebarViews,
  SecondarySidebarViews,
} from "."
import { ViewState, SidebarID, Side } from "./types"
import { withDelayRender } from "../../withDelayRender"

export const [ViewStateContext, useViewState] = createContext<ViewState>()

const useSidebarToggleable = (
  settingName:
    | "primarySidebarIsOpen"
    | "secondarySidebarIsOpen"
    | "navigatorSidebarIsOpen",
  hooks?: ToggleableHooks
) => {
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  const [isOpen, setIsOpen] = useState(defaultLocalSettings[settingName])

  useEffect(() => {
    getLocalSetting(settingName).then((value) => setIsOpen(value))
  }, [getLocalSetting, settingName])

  const onChange = useCallback(
    async (value: boolean) => {
      setIsOpen(value)
      await updateLocalSetting(settingName, value)
      return
    },
    [settingName, updateLocalSetting]
  )

  const sidebarMethods = useStatelessToggleable(isOpen, onChange, hooks)

  return { ...sidebarMethods, isOpen }
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const navigatorToggleable = useSidebarToggleable("navigatorSidebarIsOpen")

  // TODO: maybe move this to become a property of the navigator sidebar
  const [wasNavigatorOpen, setWasNavigatorOpen] = useState(
    navigatorToggleable.isOpen
  )

  const primaryToggleable = useSidebarToggleable("primarySidebarIsOpen", {
    onBeforeClose: () => {
      setWasNavigatorOpen(navigatorToggleable.isOpen)
      navigatorToggleable.close()
    },
    onAfterOpen: () => {
      if (wasNavigatorOpen) {
        navigatorToggleable.open()
      }
    },
  })
  const secondaryToggleable = useSidebarToggleable("secondarySidebarIsOpen")

  const [isLoading, setIsLoading] = useState(true)

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState(
    defaultLocalSettings.primarySidebarCurrentView
  )
  const [
    primarySidebarCurrentSubviews,
    setPrimarySidebarCurrentSubviews,
  ] = useState(defaultLocalSettings.primarySidebarCurrentSubviews)
  const [
    secondarySidebarCurrentView,
    setSecondarySidebarCurrentView,
  ] = useState(defaultLocalSettings.secondarySidebarCurrentView)
  const [expandedKeys, setExpandedKeys] = useState(
    defaultLocalSettings.expandedKeys
  )

  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  const { open: openPrimary } = primaryToggleable
  const { open: openSecondary } = secondaryToggleable

  useEffect(() => {
    ;(async () => {
      const primarySidebarCurrentView = await getLocalSetting(
        "primarySidebarCurrentView"
      )
      const primarySidebarCurrentSubviews = await getLocalSetting(
        "primarySidebarCurrentSubviews"
      )
      const secondarySidebarCurrentView = await getLocalSetting(
        "secondarySidebarCurrentView"
      )
      const expandedKeys = await getLocalSetting("expandedKeys")
      setPrimarySidebarCurrentView(primarySidebarCurrentView)
      setPrimarySidebarCurrentSubviews(primarySidebarCurrentSubviews)
      setSecondarySidebarCurrentView(secondarySidebarCurrentView)
      setExpandedKeys(expandedKeys)
      setIsLoading(false)
    })()
  }, [getLocalSetting])

  const switchPrimaryView = useCallback(
    async (view: PrimarySidebarViews) => {
      setPrimarySidebarCurrentView(view)

      if (!primaryToggleable.isOpen) {
        openPrimary()
      }

      await updateLocalSetting("primarySidebarCurrentView", view)
    },
    [openPrimary, primaryToggleable.isOpen, updateLocalSetting]
  )

  const switchPrimarySubview = useCallback(
    async <T extends keyof PrimarySidebarSubviews>(
      view: PrimarySidebarViews,
      subview: PrimarySidebarSubview<T>
    ) => {
      setPrimarySidebarCurrentSubviews((prevValue) => {
        const newValue = {
          ...prevValue,
          [view]: subview,
        }
        updateLocalSetting("primarySidebarCurrentSubviews", newValue)
        return newValue
      })
      switchPrimaryView(view)
    },
    [switchPrimaryView, updateLocalSetting]
  )

  // TODO: create a view switch wrapper for primary sidebar that can handle both views, and subviews

  const switchSecondaryView = useCallback(
    async (view: SecondarySidebarViews) => {
      setSecondarySidebarCurrentView(view)

      if (!secondaryToggleable.isOpen) {
        openSecondary()
      }

      await updateLocalSetting("secondarySidebarCurrentView", view)
    },
    [openSecondary, secondaryToggleable.isOpen, updateLocalSetting]
  )

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
      switchView: switchSecondaryView,
    }),
    [secondaryToggleable, secondarySidebarCurrentView, switchSecondaryView]
  )

  const navigatorSidebar = useMemo(
    () => ({
      ...navigatorToggleable,
      id: SidebarID.navigator,
      side: Side.left,
      minWidth: 150,
      maxWidth: 300,
      expandedKeys,
      setExpandedKeys,
    }),
    [expandedKeys, navigatorToggleable]
  )

  return (
    <ViewStateContext.Provider
      value={{
        navigatorSidebar,
        primarySidebar,
        secondarySidebar,
      }}
    >
      {isLoading ? <LoadingState /> : children}
    </ViewStateContext.Provider>
  )
}

const LoadingState: FC = withDelayRender(1000)(() => <div>Loading...</div>)
