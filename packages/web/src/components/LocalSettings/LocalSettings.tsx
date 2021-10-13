import { useState, useEffect, useCallback, FC } from "react"
import createContext from "../../utils/createContext"
import { useDatabase, LocalSettings } from "../Database"
import { useCurrentUser } from "../Auth"
import defaults from "./default"
import { LocalSettingsState } from "./types"

export const [LocalSettingsContext, useLocalSettings] = createContext<
  LocalSettingsState
>()

export class LocalSettingsDocError extends Error {
  constructor(message) {
    super(message)
    this.name = "LocalSettingsDocError"
  }
}

// TODO: consider integrating it with the MainProvider
// TODO: better handle loading states, make sure the defaults aren't used until they're necessary
export const LocalSettingsProvider: FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  //#region values of the actual local settings - separated to optimize rerendering
  // TODO: I shouldn't have to separate this - INVESTIGATE (probably replace with reducer)

  const [expandedKeys, setExpandedKeys] = useState<
    LocalSettings["expandedKeys"]
  >(defaults.expandedKeys)

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState<
    LocalSettings["primarySidebarCurrentView"]
  >(defaults.primarySidebarCurrentView)

  const [
    primarySidebarCurrentSubviews,
    setPrimarySidebarCurrentSubviews,
  ] = useState<LocalSettings["primarySidebarCurrentSubviews"]>(
    defaults.primarySidebarCurrentSubviews
  )

  const [
    secondarySidebarCurrentView,
    setSecondarySidebarCurrentView,
  ] = useState<LocalSettings["secondarySidebarCurrentView"]>(
    defaults.secondarySidebarCurrentView
  )

  const [tabs, setTabs] = useState<LocalSettings["tabs"]>(defaults.tabs)

  const [primarySidebarIsOpen, setPrimarySidebarIsOpen] = useState<
    LocalSettings["primarySidebarIsOpen"]
  >(defaults.primarySidebarIsOpen)

  const [secondarySidebarIsOpen, setSecondarySidebarIsOpen] = useState<
    LocalSettings["secondarySidebarIsOpen"]
  >(defaults.secondarySidebarIsOpen)

  const [navigatorSidebarIsOpen, setNavigatorSidebarIsOpen] = useState<
    LocalSettings["navigatorSidebarIsOpen"]
  >(defaults.navigatorSidebarIsOpen)

  const [unsyncedDocs, setUnsyncedDocs] = useState<
    LocalSettings["unsyncedDocs"]
  >(defaults.unsyncedDocs)

  //#endregion

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

          // const localSettingsData = newLocalSettingsDoc.toJSON()

          console.log(newLocalSettingsDoc)

          setExpandedKeys(newLocalSettingsDoc.expandedKeys)
          setUnsyncedDocs(newLocalSettingsDoc.unsyncedDocs)
          setPrimarySidebarCurrentView(
            newLocalSettingsDoc.primarySidebarCurrentView
          )
          setPrimarySidebarCurrentSubviews(
            newLocalSettingsDoc.primarySidebarCurrentSubviews
          )
          setSecondarySidebarCurrentView(
            newLocalSettingsDoc.secondarySidebarCurrentView
          )

          let newTabsValue = JSON.parse(newLocalSettingsDoc.tabs)
          if (
            (newTabsValue.currentTab !== null &&
              typeof newTabsValue.currentTab !== "string") ||
            (Array.isArray(newTabsValue.tabs) &&
              newTabsValue.tabs.some((t) => typeof t !== "string"))
          ) {
            // throw new LocalSettingsDocError(
            //   `Tabs couldn't be parsed properly. Received string: ${newLocalSettingsDoc.tabs}`
            // )
            newTabsValue = defaults.tabs
          }
          setTabs(newTabsValue)

          setPrimarySidebarIsOpen(newLocalSettingsDoc.primarySidebarIsOpen)
          setSecondarySidebarIsOpen(newLocalSettingsDoc.secondarySidebarIsOpen)
          setNavigatorSidebarIsOpen(newLocalSettingsDoc.navigatorSidebarIsOpen)

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
      // Optimistically updates the state
      switch (key) {
        case "expandedKeys":
          setExpandedKeys(value)
          break
        case "unsyncedDocs":
          setUnsyncedDocs(value)
          break
        case "primarySidebarCurrentView":
          setPrimarySidebarCurrentView(value)
          break
        case "primarySidebarCurrentSubviews":
          setPrimarySidebarCurrentSubviews(value)
          break
        case "secondarySidebarCurrentView":
          setSecondarySidebarCurrentView(value)
          break
        case "tabs":
          setTabs(value)
          break
        case "primarySidebarIsOpen":
          setPrimarySidebarIsOpen(value)
          break
        case "secondarySidebarIsOpen":
          setSecondarySidebarIsOpen(value)
          break
        case "navigatorSidebarIsOpen":
          setNavigatorSidebarIsOpen(value)
          break
        default:
          throw new Error(`unknown setting ${key}`)
      }

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
