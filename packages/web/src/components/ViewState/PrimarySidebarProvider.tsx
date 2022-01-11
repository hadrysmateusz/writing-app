import React, { FC, useCallback, useEffect, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"
import { LocalSettings } from "../Database"

import {
  Side,
  PrimarySidebar,
  SidebarPaths,
  SidebarView,
  SwitchPrimarySidebarViewFn,
} from "./types"
import { useSidebarToggleable } from "./useSidebarToggleable"
import { useNavigatorSidebar } from "./NavigatorSidebarProvider"
import { SidebarsLoadingAction } from "./ViewStateProvider"
import { createSidebarPath } from "./helpers"

type PrimarySidebarContextValue = PrimarySidebar

const PrimarySidebarContext = React.createContext<
  PrimarySidebarContextValue | undefined
>(undefined)

export const PrimarySidebarProvider: FC<{
  loadingStateDispatch: React.Dispatch<SidebarsLoadingAction>
}> = ({ children, loadingStateDispatch }) => {
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()
  const navigatorSidebar = useNavigatorSidebar()

  // TODO: add persistance
  const [collapsedIdentifiers, setCollapsedIdentifiers] = useState<
    PrimarySidebarContextValue["collapsedIdentifiers"]
  >([])

  const toggleSection = useCallback((identifier: string, value?: boolean) => {
    setCollapsedIdentifiers((prev) => {
      const index = prev.indexOf(identifier)
      const isCollapsed = index !== -1

      if (isCollapsed && [undefined, true].includes(value)) {
        // We use filter to remove all occurences of identifier which will work even if a duplicate identifier somehow got into the array
        return prev.filter((val) => val !== identifier)
      }

      if (!isCollapsed && [undefined, false].includes(value)) {
        // We use set to ensure no duplicates
        return Array.from(new Set([...prev, identifier]))
      }

      return prev
    })
  }, [])

  console.log(collapsedIdentifiers)

  const [documentsListDisplayType, setDocumentsListDisplayType] = useState<
    LocalSettings["documentsListDisplayType"]
  >(defaultLocalSettings.documentsListDisplayType)

  // TODO: this depends on the NavigatorSidebarProvider being an ancestor of the PrimarySidebarProvider and might cause issues in the future, find a different solution (maybe an effect in the navigator or primary sidebar component but that seems hacky)
  // TODO: maybe move this to become a property of the navigator sidebar
  const [wasNavigatorOpen, setWasNavigatorOpen] = useState(
    navigatorSidebar.isOpen
  )

  const toggleable = useSidebarToggleable("primary", {
    onBeforeClose: () => {
      setWasNavigatorOpen(navigatorSidebar.isOpen)
      navigatorSidebar.close()
    },
    onAfterOpen: () => {
      if (wasNavigatorOpen) {
        navigatorSidebar.open()
      }
    },
  })

  useEffect(() => {
    ;(async () => {
      const documentsListDisplayType_ = await getLocalSetting(
        "documentsListDisplayType"
      )
      const sidebars = await getLocalSetting("sidebars")
      setDocumentsListDisplayType(documentsListDisplayType_)
      setPrimarySidebarCurrentView(sidebars.primary.currentView)
      setPrimarySidebarCurrentSubviews(sidebars.primary.currentPaths)
      loadingStateDispatch({ type: "sidebar-ready", sidebarId: "primary" })
    })()
  }, [getLocalSetting, loadingStateDispatch])

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState(
    defaultLocalSettings.sidebars.primary.currentView
  )

  const [primarySidebarCurrentSubviews, setPrimarySidebarCurrentSubviews] =
    useState<SidebarPaths<"primary">>(
      defaultLocalSettings.sidebars.primary.currentPaths
    )

  const switchPrimaryView = useCallback(
    async (view: SidebarView<"primary">) => {
      let viewHasChanged: boolean = false

      setPrimarySidebarCurrentView((oldView) => {
        viewHasChanged = oldView !== view
        return view
      })

      if (!toggleable.isOpen) {
        toggleable.open()
      }

      // TODO: this might not work, it's still not persisted correctly
      // we persist the view change only if it has changed for performance and to avoid race conditions in certain scenarios
      if (viewHasChanged) {
        // TODO: remove duplication (probably by reworking updateLocalSetting method)
        const sidebarsSetting = await getLocalSetting("sidebars")

        const newSidebarsValue: LocalSettings["sidebars"] = {
          ...sidebarsSetting,
          primary: {
            ...sidebarsSetting["primary"],
            currentView: view,
          },
        }

        await updateLocalSetting("sidebars", newSidebarsValue)
      }
      return
    },
    [getLocalSetting, toggleable, updateLocalSetting]
  )

  // TODO: create a generalized function for switching views and subviews of any sidebar based on a path
  const switchPrimarySubview = useCallback<SwitchPrimarySidebarViewFn>(
    async (view, subview, id) => {
      const sidebarsSetting = await getLocalSetting("sidebars")

      let newSidebarsValue: LocalSettings["sidebars"] =
        defaultLocalSettings.sidebars

      setPrimarySidebarCurrentSubviews((prevValue) => {
        const newPath = createSidebarPath(view, subview, id)

        const newValue: SidebarPaths<"primary"> = {
          ...prevValue,
          [view]: newPath,
        }

        newSidebarsValue = {
          ...sidebarsSetting,
          primary: {
            ...sidebarsSetting["primary"],
            currentPaths: newValue,
          },
        }

        return newValue
      })

      updateLocalSetting("sidebars", newSidebarsValue)

      switchPrimaryView(view)
    },
    [getLocalSetting, switchPrimaryView, updateLocalSetting]
  )

  const switchDocumentsListDisplayType = useCallback(
    (value: LocalSettings["documentsListDisplayType"]) => {
      setDocumentsListDisplayType(value)
      updateLocalSetting("documentsListDisplayType", value)
    },
    [updateLocalSetting]
  )

  const value: PrimarySidebarContextValue = useMemo(
    () => ({
      ...toggleable,
      id: "primary",
      side: Side.left,
      minWidth: 180,
      maxWidth: 400,
      documentsListDisplayType,
      currentView: primarySidebarCurrentView,
      currentSubviews: primarySidebarCurrentSubviews,
      collapsedIdentifiers,
      toggleSection,
      switchView: switchPrimaryView,
      switchSubview: switchPrimarySubview,
      switchDocumentsListDisplayType,
    }),
    [
      documentsListDisplayType,
      collapsedIdentifiers,
      primarySidebarCurrentSubviews,
      primarySidebarCurrentView,
      switchDocumentsListDisplayType,
      switchPrimarySubview,
      switchPrimaryView,
      toggleSection,
      toggleable,
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
