import React, { useState, useEffect, useMemo, useCallback } from "react"
import createContext from "../../utils/createContext"
import { useDatabase, LocalSettingsDoc, LocalSettings } from "../Database"
import { useCurrentUser } from "../Auth"
import defaults from "./default"

export type LocalSettingsState = LocalSettings & {
  updateLocalSetting: <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => Promise<LocalSettingsDoc>
}

export const [LocalSettingsContext, useLocalSettings] = createContext<
  LocalSettingsState
>()

// TODO: consider integrating it with the MainProvider
// TODO: better handle loading states, make sure the defaults aren't used until they're necessary

export const LocalSettingsProvider: React.FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  /**
   * RxDB query that fetches the local settings
   */
  const query = useMemo(() => db.local_settings.findOne(currentUser.username), [
    currentUser.username,
    db.local_settings,
  ])

  /**
   * RxDB document containing the local settings
   */
  const [
    localSettingsDoc,
    setLocalSettingsDoc,
  ] = useState<LocalSettingsDoc | null>(null)

  //#region values of the actual local settings - separated to optimize rerendering
  // TODO: I shouldn't have to separate this - INVESTIGATE

  const [expandedKeys, setExpandedKeys] = useState<
    LocalSettings["expandedKeys"]
  >(defaults.expandedKeys)

  const [primarySidebarCurrentView, setPrimarySidebarCurrentView] = useState<
    LocalSettings["primarySidebarCurrentView"]
  >(defaults.primarySidebarCurrentView)

  const [
    secondarySidebarCurrentView,
    setSecondarySidebarCurrentView,
  ] = useState<LocalSettings["secondarySidebarCurrentView"]>(
    defaults.secondarySidebarCurrentView
  )

  const [currentEditor, setCurrentEditor] = useState<
    LocalSettings["currentEditor"]
  >(defaults.currentEditor)

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
    // console.log(isInitialLoad, currentUser.username)

    if (isInitialLoad) {
      db.local_settings
        .findOne(currentUser.username)
        .exec()
        .then((newLocalSettingsDoc) => {
          if (!newLocalSettingsDoc) {
            db.local_settings.insert({
              ...defaults,
              userId: currentUser.username,
            })
          }

          const data = newLocalSettingsDoc?.toJSON()

          /**
           * Updates internal state for a given setting if it's present on the fetched document
           *
           * TODO: better handle the case where the value is not present because that indicates an issue (maybe use the default, or even update the RxDB collection with the default)
           */
          const update = <K extends keyof LocalSettings>(
            key: K,
            updater: React.Dispatch<React.SetStateAction<LocalSettings[K]>>
          ) => {
            const value = data?.[key]
            if (value === undefined) return
            updater(value)
          }

          console.log("newLocalSettingsDoc", newLocalSettingsDoc)

          setLocalSettingsDoc(newLocalSettingsDoc)

          //#region update all the values of settings in state

          update("expandedKeys", setExpandedKeys)
          update("unsyncedDocs", setUnsyncedDocs)
          update("primarySidebarCurrentView", setPrimarySidebarCurrentView)
          update("secondarySidebarCurrentView", setSecondarySidebarCurrentView)
          update("currentEditor", setCurrentEditor)
          update("primarySidebarIsOpen", setPrimarySidebarIsOpen)
          update("secondarySidebarIsOpen", setSecondarySidebarIsOpen)
          update("navigatorSidebarIsOpen", setNavigatorSidebarIsOpen)

          //#endregion

          setIsInitialLoad(false)
        })
    }
  }, [currentUser.username, db.local_settings, isInitialLoad])

  // Set up local settings subscription
  useEffect(() => {
    const subscription = query.$.subscribe((newLocalSettingsDoc) => {
      console.log(newLocalSettingsDoc)
      setLocalSettingsDoc(newLocalSettingsDoc)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [query.$])

  /**
   * Updates a setting under the given key with the given value
   *
   * @param key the key of the attribute to be modified. The key can be nested
   * by using the dot syntax, like this: nested.attribute
   *
   * @todo this typing doesn't support nested properties
   */
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
        case "secondarySidebarCurrentView":
          setSecondarySidebarCurrentView(value)
          break
        case "currentEditor":
          setCurrentEditor(value)
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

      if (localSettingsDoc === null) {
        throw Error("The localSettingsDoc object is missing")
      }

      try {
        const newDoc = await localSettingsDoc.atomicSet(key, value)
        return newDoc
      } catch (error) {
        // TODO: better error handling
        console.error("Local settings change wasn't saved")
        throw error
      }
    },
    [localSettingsDoc]
  )

  return (
    <LocalSettingsContext.Provider
      value={{
        updateLocalSetting,
        expandedKeys,
        unsyncedDocs,
        primarySidebarCurrentView,
        secondarySidebarCurrentView,
        currentEditor,
        primarySidebarIsOpen,
        secondarySidebarIsOpen,
        navigatorSidebarIsOpen,
      }}
    >
      {isInitialLoad ? null : children}
    </LocalSettingsContext.Provider>
  )
}
