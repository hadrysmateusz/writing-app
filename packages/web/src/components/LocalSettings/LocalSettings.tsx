import { useState, useEffect, useCallback, FC, useRef } from "react"

import { useDatabase, LocalSettings } from "../Database"
import { useCurrentUser } from "../Auth"

import defaults from "./default"
import { LocalSettingsStore } from "./types"
import useLocalSetting from "./useLocalSetting"
import { LocalSettingsContext } from "./misc"
import { LocalSettingsDocError } from "."

// TODO: consider integrating it with the MainProvider
// TODO: better handle loading states, make sure the defaults aren't used until they're necessary
export const LocalSettingsProvider: FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const localSettingsStoreRef = useRef<LocalSettingsStore>({})

  const expandedKeys = useLocalSetting<LocalSettings["expandedKeys"]>(
    "expandedKeys",
    localSettingsStoreRef
  )

  const primarySidebarCurrentView = useLocalSetting<
    LocalSettings["primarySidebarCurrentView"]
  >("primarySidebarCurrentView", localSettingsStoreRef)

  const primarySidebarCurrentSubviews = useLocalSetting<
    LocalSettings["primarySidebarCurrentSubviews"]
  >("primarySidebarCurrentSubviews", localSettingsStoreRef)

  const secondarySidebarCurrentView = useLocalSetting<
    LocalSettings["secondarySidebarCurrentView"]
  >("secondarySidebarCurrentView", localSettingsStoreRef)

  const tabs = useLocalSetting<LocalSettings["tabs"]>(
    "tabs",
    localSettingsStoreRef,
    {
      requiresCustomDefaultSetter: true,
    }
  )

  const primarySidebarIsOpen = useLocalSetting<
    LocalSettings["primarySidebarIsOpen"]
  >("primarySidebarIsOpen", localSettingsStoreRef)

  const secondarySidebarIsOpen = useLocalSetting<
    LocalSettings["secondarySidebarIsOpen"]
  >("secondarySidebarIsOpen", localSettingsStoreRef)

  const navigatorSidebarIsOpen = useLocalSetting<
    LocalSettings["navigatorSidebarIsOpen"]
  >("navigatorSidebarIsOpen", localSettingsStoreRef)

  const unsyncedDocs = useLocalSetting<LocalSettings["unsyncedDocs"]>(
    "unsyncedDocs",
    localSettingsStoreRef
  )

  // Get the local settings for the first time
  useEffect(() => {
    if (isInitialLoad) {
      db.local_settings
        .findOne(currentUser.username)
        .exec()
        .then(async (newLocalSettingsDoc) => {
          // If a local settings doc is not present, create one
          // TODO: handle this better (perhaps through a unified first launch process)
          if (!newLocalSettingsDoc) {
            newLocalSettingsDoc = await db.local_settings.insert({
              ...defaults,
              tabs: JSON.stringify(defaults.tabs),
              userId: currentUser.username,
            })
          }

          const nonNullSettingsDoc = newLocalSettingsDoc

          /**
           *  Set initial values for all settings
           */
          // This will cause multiple rerenders because of setState calls which could be optimized with a reducer
          // or a wrapper component which fetches the local settings doc and passes it into this component as a prop which is then used in the initial value setter of the setState call
          // ^ Although this might not matter because most of the app is a conditionally rendered child of this component
          Object.entries(localSettingsStoreRef.current).forEach(
            ([key, settingsObj]) => {
              console.log(key, settingsObj)
              if (!settingsObj.requiresCustomDefaultSetter) {
                settingsObj.setValue(nonNullSettingsDoc[key])
              } else {
                switch (key) {
                  case "tabs": {
                    let newValue = JSON.parse(nonNullSettingsDoc.tabs)

                    const isCurrentTabTypeCorrect = !(
                      newValue.currentTab !== null &&
                      typeof newValue.currentTab !== "string"
                    )

                    const isTabsTypeCorrect = !(
                      Array.isArray(newValue.tabs) &&
                      newValue.tabs.some((t) => typeof t !== "string")
                    )

                    if (isCurrentTabTypeCorrect && isTabsTypeCorrect) {
                      console.warn(
                        `Tabs couldn't be parsed properly. Received string: ${nonNullSettingsDoc.tabs}`
                      )
                      newValue = defaults.tabs
                    }

                    settingsObj.setValue(newValue)

                    break
                  }
                  default:
                    throw new Error(
                      `Local setting: ${key} is missing a default setter`
                    )
                }
              }
            }
          )

          setIsInitialLoad(false)
        })
    }
  }, [currentUser.username, db.local_settings, isInitialLoad])

  /**
   * Updates a setting under the given key with the given value
   *
   * @param key the key of the attribute to be modified. The key can be nested
   * by using the dot syntax, like this: nested.attribute
   *
   * @todo this typing doesn't support nested properties
   */
  // TODO: replace this whole system with a simple reducer based approach
  const updateLocalSetting = useCallback(
    async <K extends keyof LocalSettings>(key: K, value: any) => {
      if (!localSettingsStoreRef.current[key]) {
        throw new Error(`unknown setting ${key}`)
      }

      // Optimistically updates the state
      localSettingsStoreRef.current[key]?.setValue(value)

      try {
        const localSettingsDoc = await db.local_settings
          .findOne(currentUser.username)
          .exec()

        if (localSettingsDoc === null) {
          throw new LocalSettingsDocError(
            `Couldn't find a local settings doc for user: ${currentUser.username}`
          )
        }

        // value of tabs is a nested object so it has to get stringified
        if (key === "tabs") {
          value = JSON.stringify(value)
        }

        const newDoc = await localSettingsDoc.atomicPatch({ [key]: value })
        return newDoc
      } catch (error) {
        // TODO: better error handling
        if (error instanceof LocalSettingsDocError) {
          console.error(error.message)
        } else {
          console.error("Local settings change wasn't saved")
        }
        throw error // rethrow
      }
    },
    [currentUser.username, db.local_settings]
  )

  // TODO: actually the individual values should be replaced by a general getter function using a ref or a function that queries the database directly because exposing them here only leads to unnecessary rerenders as these aren't supposed to be often-changing direct-access values (they are often re-exposed by their respective managers/providers)
  return (
    <LocalSettingsContext.Provider
      value={{
        updateLocalSetting,
        expandedKeys,
        unsyncedDocs,
        primarySidebarCurrentView,
        primarySidebarCurrentSubviews,
        secondarySidebarCurrentView,
        tabs,
        primarySidebarIsOpen,
        secondarySidebarIsOpen,
        navigatorSidebarIsOpen,
      }}
    >
      {isInitialLoad ? null : children}
    </LocalSettingsContext.Provider>
  )
}
