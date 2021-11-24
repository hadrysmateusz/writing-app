import { useCallback, useEffect, useMemo, useState } from "react"

import { useLocalSettings, defaultLocalSettings } from "../LocalSettings"

import { ToggleableHooks, useStatelessToggleable } from "../../hooks"

import { LocalSettings, LocalSettingsDoc } from "../Database"
import { SidebarSidebar } from "."

export const useSidebarToggleable = (
  sidebarId: SidebarSidebar,
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
      console.log("onChange", value, sidebarId)
      setIsOpen(value)
      const sidebarsSetting = await getLocalSetting("sidebars")

      const newSideabarsValue: LocalSettings["sidebars"] = {
        ...sidebarsSetting,
        [sidebarId]: {
          ...sidebarsSetting[sidebarId],
          isOpen: value,
        },
      }

      console.log(newSideabarsValue)

      return await updateLocalSetting("sidebars", newSideabarsValue)
    },
    [getLocalSetting, sidebarId, updateLocalSetting]
  )

  const sidebarMethods = useStatelessToggleable(isOpen, onChange, hooks)

  return useMemo(() => ({ ...sidebarMethods, isOpen }), [
    isOpen,
    sidebarMethods,
  ])
}
