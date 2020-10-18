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
} from "./types"

export const [ViewStateContext, useViewState] = createContext<ViewState>()

const usePrimarySidebar = () => {
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
    id: "primarySidebar",
    switchView,
  } as MultiViewSidebar
}

const useSecondarySidebar = () => {
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
    id: "secondarySidebar",
    switchView,
  } as MultiViewSidebar
}

const useNavigatorSidebar = () => {
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
    id: "secondarySidebar",
  } as SingleViewSidebar
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const primarySidebar = usePrimarySidebar()
  const secondarySidebar = useSecondarySidebar()
  const navigatorSidebar = useNavigatorSidebar()

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
