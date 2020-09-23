import React, { createContext, useCallback } from "react"
import { useStatelessToggleable, Toggleable } from "../../hooks"
import { useRequiredContext } from "../../hooks/useRequiredContext"
import { useLocalSettings } from "../LocalSettings"
import defaultLocalSettings from "../LocalSettings/default"

export type SwitchViewFn = (view: string | null) => void

export type MultiViewSidebar = Toggleable & {
  currentView: string
  switchView: SwitchViewFn
}

export type SingleViewSidebar = Toggleable & {}

export type ViewState = {
  primarySidebar: MultiViewSidebar
  secondarySidebar: MultiViewSidebar
  navigatorSidebar: SingleViewSidebar
}

const ViewStateContext = createContext<ViewState | null>(null)

export const useViewState = () => {
  return useRequiredContext<ViewState>(
    ViewStateContext,
    "ViewState context is null"
  )
}

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
    switchView,
  }
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
    switchView,
  }
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

  return { ...navigatorSidebar, isOpen: navigatorSidebarIsOpen }
}

export const ViewStateProvider: React.FC<{}> = ({ children }) => {
  const primarySidebar = usePrimarySidebar()
  const secondarySidebar = useSecondarySidebar()
  const navigatorSidebar = useNavigatorSidebar()

  console.log({
    primarySidebar,
    navigatorSidebar,
    secondarySidebar,
  })

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
