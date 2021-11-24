import React, { useCallback, useEffect, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"

import { ToggleableHooks, useStatelessToggleable } from "../../hooks"
import { createContext } from "../../utils"

import { ViewState, SidebarID, Side } from "./types"
// import { withDelayRender } from "../../withDelayRender"
import { LocalSettings, LocalSettingsDoc } from "../Database"
import {
  NavigatorSidebar,
  PrimarySidebar,
  SecondarySidebar,
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

type NavigatorSidebarContextValue = NavigatorSidebar
type PrimarySidebarContextValue = PrimarySidebar
type SecondarySidebarContextValue = SecondarySidebar

// Contexts
const NavigatorSidebarContext = React.createContext<
  NavigatorSidebarContextValue | undefined
>(undefined)
const PrimarySidebarContext = React.createContext<
  PrimarySidebarContextValue | undefined
>(undefined)
const SecondarySidebarContext = React.createContext<
  SecondarySidebarContextValue | undefined
>(undefined)

// Providers
const NavigatorSidebarProvider = ({ children }) => {
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
const PrimarySidebarProvider = ({ children }) => {
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  // // TODO: maybe move this to become a property of the navigator sidebar
  // const [wasNavigatorOpen, setWasNavigatorOpen] = useState(
  //   navigatorToggleable.isOpen
  // )

  const toggleable = useSidebarToggleable("primary", {
    // onBeforeClose: () => {
    //   setWasNavigatorOpen(navigatorToggleable.isOpen)
    //   navigatorToggleable.close()
    // },
    // onAfterOpen: () => {
    //   if (wasNavigatorOpen) {
    //     navigatorToggleable.open()
    //   }
    // },
  })

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState(
    defaultLocalSettings.sidebars.primary.currentView
  )

  const [
    primarySidebarCurrentSubviews,
    setPrimarySidebarCurrentSubviews,
  ] = useState<SidebarPaths<"primary">>(
    defaultLocalSettings.sidebars.primary.currentPaths
  )

  const switchPrimaryView = useCallback(
    async (view: SidebarView<"primary">) => {
      setPrimarySidebarCurrentView(view)

      if (!toggleable.isOpen) {
        toggleable.open()
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
    [getLocalSetting, toggleable, updateLocalSetting]
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

  const value = useMemo(
    () => ({
      ...toggleable,
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
      toggleable,
      switchPrimarySubview,
      switchPrimaryView,
    ]
  )
  return (
    <PrimarySidebarContext.Provider value={value}>
      {children}
    </PrimarySidebarContext.Provider>
  )
}
const SecondarySidebarProvider = ({ children }) => {
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

// Consumer hooks
export const useNavigatorSidebar = () => {
  const context = React.useContext(NavigatorSidebarContext)
  if (!context) {
    throw new Error(
      "useNavigatorSidebar must be used within NavigatorSidebarProvider"
    )
  }
  return context
}
export const usePrimarySidebar = () => {
  const context = React.useContext(PrimarySidebarContext)
  if (!context) {
    throw new Error(
      "usePrimarySidebar must be used within PrimarySidebarProvider"
    )
  }
  return context
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
  // const [isLoading, setIsLoading] = useState(true)

  // const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  // useEffect(() => {
  //   ;(async () => {
  //     const sidebars = await getLocalSetting("sidebars")
  //     const expandedKeys = await getLocalSetting("expandedKeys")

  //     setPrimarySidebarCurrentView(sidebars.primary.currentView)
  //     setSecondarySidebarCurrentView(sidebars.secondary.currentView)

  //     setPrimarySidebarCurrentSubviews(sidebars.primary.currentPaths)

  //     setExpandedKeys(expandedKeys)

  //     setIsLoading(false)
  //   })()
  // }, [getLocalSetting])

  // TODO: instead of many separate state variables use a single complex state (that better matches the one saved in LocalSettings) with a reducer

  return (
    <NavigatorSidebarProvider>
      <PrimarySidebarProvider>
        <SecondarySidebarProvider>{children}</SecondarySidebarProvider>
      </PrimarySidebarProvider>
    </NavigatorSidebarProvider>
  )

  // return (

  //     {isLoading ? <LoadingState /> : children}

  // )
}

// const LoadingState: FC = withDelayRender(1000)(() => <div>Loading...</div>)
