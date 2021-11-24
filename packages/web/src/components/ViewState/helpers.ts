import { useCallback, useEffect, useMemo, useState } from "react"

import { ToggleableHooks, useStatelessToggleable } from "../../hooks"

import { defaultLocalSettings } from "../LocalSettings"
import { LocalSettingsDoc, useDatabase } from "../Database"
import { useCurrentUser } from "../Auth"

import { SidebarSidebar } from "./types"

export const useSidebarToggleable = (
  sidebarId: SidebarSidebar,
  hooks?: ToggleableHooks
) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()

  const [isOpen, setIsOpen] = useState(
    defaultLocalSettings.sidebars[sidebarId].isOpen
  )

  // TODO: for some reason getLocalSetting and updateLocalSetting methods result in stale data and bugs

  useEffect(() => {
    setTimeout(() => {
      db.local_settings
        .findOne(currentUser.username)
        .exec()
        .then((localSettingsDoc) => {
          if (localSettingsDoc === null) {
            throw new Error(
              `Couldn't find a local settings doc for user: ${currentUser.username}`
            )
          }
          setIsOpen(localSettingsDoc.sidebars[sidebarId].isOpen)
        })
    })
  }, [currentUser.username, db.local_settings, sidebarId])

  const onChange = useCallback(
    async (value: boolean): Promise<LocalSettingsDoc | void> => {
      setIsOpen(value)

      db.local_settings
        .findOne(currentUser.username)
        .exec()
        .then((localSettingsDoc) => {
          if (localSettingsDoc === null) {
            throw new Error(
              `Couldn't find a local settings doc for user: ${currentUser.username}`
            )
          }

          localSettingsDoc.update({
            $set: { [`sidebars.${sidebarId}.isOpen`]: value },
          })
        })
    },
    [currentUser.username, db.local_settings, sidebarId]
  )

  const sidebarMethods = useStatelessToggleable(isOpen, onChange, hooks)

  return useMemo(() => ({ ...sidebarMethods, isOpen }), [
    isOpen,
    sidebarMethods,
  ])
}
