import React, { useCallback, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"
import { LocalSettings } from "../Database"

import {
  SidebarID,
  Side,
  PrimarySidebar,
  SidebarPaths,
  SidebarView,
  SwitchPrimarySidebarViewFn,
} from "./types"
import { useSidebarToggleable } from "./helpers"

type PrimarySidebarContextValue = PrimarySidebar

const PrimarySidebarContext = React.createContext<
  PrimarySidebarContextValue | undefined
>(undefined)

export const PrimarySidebarProvider = ({ children }) => {
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

export const usePrimarySidebar = () => {
  const context = React.useContext(PrimarySidebarContext)
  if (!context) {
    throw new Error(
      "usePrimarySidebar must be used within PrimarySidebarProvider"
    )
  }
  return context
}
