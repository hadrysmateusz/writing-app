import { useState, useEffect, useCallback, FC } from "react"

import { useDatabase, LocalSettings, LocalSettingsDoc } from "../Database"
import { useCurrentUser } from "../Auth"

import defaults from "./default"
import { LocalSettingsContext } from "./misc"
import { LocalSettingsDocError } from "."
import { TabsState } from "../MainProvider/tabsSlice"

// TODO: consider integrating it with the MainProvider
// TODO: better handle loading states, make sure the defaults aren't used until they're necessary
export const LocalSettingsProvider: FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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

          setIsInitialLoad(false)
        })
    }
  }, [currentUser.username, db.local_settings, isInitialLoad])

  const getLocalSetting = useCallback(
    async <K extends keyof LocalSettings>(
      key: K
    ): Promise<LocalSettings[K]> => {
      const localSettingsDoc: LocalSettingsDoc | null = await db.local_settings
        .findOne(currentUser.username)
        .exec()

      if (localSettingsDoc === null) {
        throw new LocalSettingsDocError(
          `Couldn't find a local settings doc for user: ${currentUser.username}`
        )
      }

      function isTabsValueValid(value: any): value is TabsState {
        // is value an object
        if (!(typeof value === "object" && value !== null)) return false

        // does it have correct properties
        if (!("currentTab" in value && "tabs" in value)) return false

        // are the properties of correct types
        const isCurrentTabTypeCorrect = typeof value["currentTab"] === "string"
        const isTabsTypeCorrect =
          typeof value["tabs"] === "object" &&
          Object.entries(value["tabs"]).every(([k, v]) => {
            // are key and value of correct types
            if (
              !(typeof k === "string" && typeof v === "object" && v !== null)
            ) {
              return false
            }
            // is tabId property correct
            if (typeof v["tabId"] !== "string") {
              return false
            }
            // check properties dependent on tab type (could be replaced with a switch)
            if (v["tabType"] === "cloudDocument") {
              // is documentId property correct
              if (typeof v["documentId"] !== "string") {
                return false
              }
            }
            if (v["tabType"] === "cloudNew") {
              // this tab type currently has no special properties
            }
            // all checks passed
            return true
          })
        if (!isCurrentTabTypeCorrect || !isTabsTypeCorrect) return false

        // value is valid
        return true
      }

      function isKeyNotTabs(k: K): k is Exclude<K, "tabs"> {
        return k !== "tabs"
      }

      function isKeyTabs(k: K): k is Extract<K, "tabs"> {
        return k === "tabs"
      }

      if (isKeyNotTabs(key)) {
        let value: unknown = localSettingsDoc[key] // For now this casting is required for typescript to not complain
        return value as LocalSettings[K]
      }

      if (isKeyTabs(key)) {
        let stringifiedValue = localSettingsDoc[key]
        let parsedValue: unknown = JSON.parse(stringifiedValue)

        // validate if the value was properly parsed
        if (isTabsValueValid(parsedValue)) {
          return parsedValue as LocalSettings[K]
        } else {
          // If there is an issue parsing tabs from local storage, fall back to the default tabs value
          console.error(
            `Tabs couldn't be parsed properly. Received string: ${localSettingsDoc.tabs}`
          )
          return defaults.tabs as LocalSettings[K]
        }
      }

      throw new Error("Something went wrong")
    },
    [currentUser.username, db.local_settings]
  )

  /**
   * Updates a setting under the given key with the given value
   *
   * @param key the key of the attribute to be modified. The key can be nested
   * by using the dot syntax, like this: nested.attribute
   *
   * @todo this typing doesn't support nested properties (use either a dotted syntax for changing nested properties or an updater function)
   */
  const updateLocalSetting = useCallback(
    async <K extends keyof LocalSettings>(
      key: K,
      value: LocalSettings[K]
    ): Promise<LocalSettingsDoc> => {
      try {
        const localSettingsDoc = await db.local_settings
          .findOne(currentUser.username)
          .exec()

        if (localSettingsDoc === null) {
          throw new LocalSettingsDocError(
            `Couldn't find a local settings doc for user: ${currentUser.username}`
          )
        }

        switch (key) {
          case "tabs": {
            // value of tabs is a nested object so it has to get stringified
            const stringifiedValue = JSON.stringify(value)
            return localSettingsDoc.atomicPatch({
              [key]: stringifiedValue,
            })
          }
          default: {
            return localSettingsDoc.atomicPatch({ [key]: value })
          }
        }
      } catch (error) {
        // TODO: better error handling
        if (error instanceof LocalSettingsDocError) {
          console.error(error.message)
        } else {
          console.error("Local settings change wasn't saved")
        }
        throw error
      }
    },
    [currentUser.username, db.local_settings]
  )

  return (
    <LocalSettingsContext.Provider
      value={{
        updateLocalSetting,
        getLocalSetting,
      }}
    >
      {isInitialLoad ? null : children}
    </LocalSettingsContext.Provider>
  )
}
