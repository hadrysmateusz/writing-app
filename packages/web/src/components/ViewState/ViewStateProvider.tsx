import React, { FC, useCallback, useEffect, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"

import { ToggleableHooks, useStatelessToggleable } from "../../hooks"
import { createContext } from "../../utils"

import { ViewState, SidebarID, Side } from "./types"
import { withDelayRender } from "../../withDelayRender"
import { LocalSettings, LocalSettingsDoc } from "../Database"
import {
  SidebarPaths,
  SidebarSidebar,
  SidebarView,
  SwitchPrimarySidebarViewFn,
} from "."

export const [ViewStateContext, useViewState] = createContext<ViewState>()

// enum SidebarSidebars {
//   "navigator" = "navigator",
//   "primary" = "primary",
//   "secondary" = "secondary",
// }
// enum SidebarViews {
//   "default" = "default",
//   "cloud" = "cloud",
//   "local" = "local",
//   "tags" = "tags",
//   "stats" = "stats",
// }
// enum SidebarSubviews {
//   "ALL" = "ALL",
//   "TRASH" = "TRASH",
//   "INBOX" = "INBOX",
//   "GROUP" = "GROUP",
// }
// enum SidebarPaths {
//   navigator_deafult_all = "navigator_deafult_all",
//   primary_cloud_all = "primary_cloud_all",
//   primary_cloud_trash = "primary_cloud_trash",
//   primary_cloud_inbox = "primary_cloud_inbox",
//   primary_cloud_group = "primary_cloud_group",
//   primary_local_all = "primary_local_all",
//   primary_tags_all = "primary_tags_all",
//   secondary_stats = "secondary_stats",
// }

const useSidebarToggleable = (
  sidebarId: SidebarSidebar, //
  hooks?: ToggleableHooks
) => {
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  const [isOpen, setIsOpen] = useState(
    () => defaultLocalSettings.sidebars[sidebarId].isOpen
  )

  useEffect(() => {
    getLocalSetting("sidebars").then((sidebars) => {
      // TODO: check this for possible performance drawbacks
      console.log(
        "changing sidebar open state because of persistent storage change"
      )
      setIsOpen(sidebars[sidebarId].isOpen)
    })
  }, [getLocalSetting, sidebarId])

  const onChange = useCallback(
    async (value: boolean): Promise<LocalSettingsDoc> => {
      setIsOpen(value)
      const sidebarsSetting = await getLocalSetting("sidebars")

      const newSideabarsValue: LocalSettings["sidebars"] = {
        ...sidebarsSetting,
        [sidebarId]: {
          ...sidebarsSetting[sidebarId],
          isOpen: value,
        },
      }

      return await updateLocalSetting("sidebars", newSideabarsValue)
    },
    [getLocalSetting, sidebarId, updateLocalSetting]
  )

  const sidebarMethods = useStatelessToggleable(isOpen, onChange, hooks)

  return { ...sidebarMethods, isOpen }
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const navigatorToggleable = useSidebarToggleable("navigator")

  // TODO: maybe move this to become a property of the navigator sidebar
  const [wasNavigatorOpen, setWasNavigatorOpen] = useState(
    navigatorToggleable.isOpen
  )

  const primaryToggleable = useSidebarToggleable("primary", {
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

  const secondaryToggleable = useSidebarToggleable("secondary")

  const [isLoading, setIsLoading] = useState(true)

  // TODO: instead of many separate state variables use a single complex state (that better matches the one saved in LocalSettings) with a reducer

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState(
    defaultLocalSettings.sidebars.primary.currentView
  )
  const [
    secondarySidebarCurrentView,
    setSecondarySidebarCurrentView,
  ] = useState(defaultLocalSettings.sidebars.secondary.currentView)

  const [
    primarySidebarCurrentSubviews,
    setPrimarySidebarCurrentSubviews,
  ] = useState<SidebarPaths<"primary">>(
    defaultLocalSettings.sidebars.primary.currentPaths
  )

  const [expandedKeys, setExpandedKeys] = useState(
    defaultLocalSettings.expandedKeys
  )

  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  const { open: openPrimary } = primaryToggleable
  const { open: openSecondary } = secondaryToggleable

  useEffect(() => {
    ;(async () => {
      const sidebars = await getLocalSetting("sidebars")
      const expandedKeys = await getLocalSetting("expandedKeys")

      setPrimarySidebarCurrentView(sidebars.primary.currentView)
      setSecondarySidebarCurrentView(sidebars.secondary.currentView)

      setPrimarySidebarCurrentSubviews(sidebars.primary.currentPaths)

      setExpandedKeys(expandedKeys)

      setIsLoading(false)
    })()
  }, [getLocalSetting])

  const switchPrimaryView = useCallback(
    async (view: SidebarView<"primary">) => {
      setPrimarySidebarCurrentView(view)

      if (!primaryToggleable.isOpen) {
        openPrimary()
      }

      // TODO: remove duplication (probably by reworking updateLocalSetting method)
      const sidebarsSetting = await getLocalSetting("sidebars")

      const newSideabarsValue: LocalSettings["sidebars"] = {
        ...sidebarsSetting,
        primary: {
          ...sidebarsSetting["primary"],
          currentView: view,
        },
      }

      await updateLocalSetting("sidebars", newSideabarsValue)
      return
    },
    [getLocalSetting, openPrimary, primaryToggleable.isOpen, updateLocalSetting]
  )

  // TODO: create a generalized function for switching views and subviews of any sidebar based on a path
  const switchPrimarySubview = useCallback<SwitchPrimarySidebarViewFn>(
    async (view, subview, id) => {
      const sidebarsSetting = await getLocalSetting("sidebars")

      let newSideabarsValue: LocalSettings["sidebars"] =
        defaultLocalSettings.sidebars

      setPrimarySidebarCurrentSubviews((prevValue) => {
        let newPath = `primary_${view}_${subview}`

        if (id) {
          newPath += `_${id}`
        }

        const newValue: SidebarPaths<"primary"> = {
          ...prevValue,
          [view]: newPath,
        }

        newSideabarsValue = {
          ...sidebarsSetting,
          primary: {
            ...sidebarsSetting["primary"],
            currentPaths: newValue,
          },
        }

        return newValue
      })

      // TODO: make sure that the newSideabarsValue assignment inside setState gets called first and the correct value is persisted
      console.log("newSidebarsValue to be persisted", newSideabarsValue)
      updateLocalSetting("sidebars", newSideabarsValue)

      switchPrimaryView(view)
    },
    [getLocalSetting, switchPrimaryView, updateLocalSetting]
  )

  // TODO: create a view switch wrapper for primary sidebar that can handle both views, and subviews

  const switchSecondaryView = useCallback(
    async (view: SidebarView<"secondary">) => {
      setSecondarySidebarCurrentView(view)

      if (!secondaryToggleable.isOpen) {
        openSecondary()
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
    [
      getLocalSetting,
      openSecondary,
      secondaryToggleable.isOpen,
      updateLocalSetting,
    ]
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
