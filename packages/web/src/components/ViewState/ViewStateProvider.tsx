import React, { useCallback } from "react"
import { useStatelessToggleable } from "../../hooks"
import { createContext } from "../../utils"
import { useLocalSettings } from "../LocalSettings"
import defaultLocalSettings from "../LocalSettings/default"
import {
  ViewState,
  SwitchViewFn,
  SingleViewSidebar,
  MultiViewSidebar,
  SidebarID,
  Side,
} from "./types"

export const [ViewStateContext, useViewState] = createContext<ViewState>()

// TODO: put this metadata on sidebar object

const sidebarSides = {
  [SidebarID.navigator]: Side.left,
  [SidebarID.primary]: Side.left,
  [SidebarID.secondary]: Side.right,
}

const usePrimarySidebarProvider = () => {
  const id = "primarySidebar"
  const side = sidebarSides[id]
  const minWidth = 180
  const maxWidth = 400

  const {
    updateLocalSetting,
    primarySidebarCurrentView,
    primarySidebarIsOpen,
  } = useLocalSettings()

  const onChange = useCallback(
    (value: boolean) => {
      updateLocalSetting("primarySidebarIsOpen", value)
    },
    [updateLocalSetting]
  )

  const primarySidebar = useStatelessToggleable(primarySidebarIsOpen, onChange)

  const switchView: SwitchViewFn = (view) => {
    const newView = view || defaultLocalSettings.primarySidebarCurrentView

    updateLocalSetting("primarySidebarCurrentView", newView)

    if (!primarySidebarIsOpen) {
      primarySidebar.open()
    }
  }

  return {
    ...primarySidebar,
    isOpen: primarySidebarIsOpen,
    currentView: primarySidebarCurrentView,
    id,
    side,
    minWidth,
    maxWidth,
    switchView,
  } as MultiViewSidebar
}

const useSecondarySidebarProvider = () => {
  const id = "secondarySidebar"
  const side = sidebarSides[id]
  const minWidth = 180
  const maxWidth = 400

  const {
    updateLocalSetting,
    secondarySidebarCurrentView,
    secondarySidebarIsOpen,
  } = useLocalSettings()

  const onChange = useCallback(
    (value: boolean) => {
      updateLocalSetting("secondarySidebarIsOpen", value)
    },
    [updateLocalSetting]
  )

  const secondarySidebar = useStatelessToggleable(
    secondarySidebarIsOpen,
    onChange
  )

  const switchView: SwitchViewFn = (view) => {
    const newView = view || defaultLocalSettings.secondarySidebarCurrentView

    updateLocalSetting("secondarySidebarCurrentView", newView)

    if (!secondarySidebarIsOpen) {
      secondarySidebar.open()
    }
  }

  return {
    ...secondarySidebar,
    isOpen: secondarySidebarIsOpen,
    currentView: secondarySidebarCurrentView,
    id,
    side,
    minWidth,
    maxWidth,
    switchView,
  } as MultiViewSidebar
}

const useNavigatorSidebarProvider = () => {
  const id = "navigatorSidebar"
  const side = sidebarSides[id]
  const minWidth = 150
  const maxWidth = 300

  const { updateLocalSetting, navigatorSidebarIsOpen } = useLocalSettings()

  const onChange = useCallback(
    (value: boolean) => {
      updateLocalSetting("navigatorSidebarIsOpen", value)
    },
    [updateLocalSetting]
  )

  const navigatorSidebar = useStatelessToggleable(
    navigatorSidebarIsOpen,
    onChange
  )

  return {
    ...navigatorSidebar,
    isOpen: navigatorSidebarIsOpen,
    id,
    side,
    minWidth,
    maxWidth,
  } as SingleViewSidebar
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const primarySidebar = usePrimarySidebarProvider()
  const secondarySidebar = useSecondarySidebarProvider()
  const navigatorSidebar = useNavigatorSidebarProvider()

  return (
    <ViewStateContext.Provider
      value={{
        primarySidebar,
        navigatorSidebar,
        secondarySidebar,
      }}
    >
      {children}
    </ViewStateContext.Provider>
  )
}
