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

export const [useLocalSettings, _, LocalSettingsContext] = createContext<
  LocalSettingsState
>()

// TODO: consider integrating it with the MainProvider

export const LocalSettingsProvider: React.FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  /**
   * RxDB document containing the local settings
   */
  const [
    localSettingsDoc,
    setLocalSettingsDoc,
  ] = useState<LocalSettingsDoc | null>(null)

  /**
   * RxDB query that fetches the local settings
   */
  const query = useMemo(() => db.local_settings.findOne(currentUser.username), [
    currentUser.username,
    db.local_settings,
  ])

  //#region values of the actual local settings - separated to optimize rerendering

  const [expandedKeys, setIsSpellCheckEnabled] = useState<
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

  //#endregion

  const updateInternalState = useCallback(
    (newLocalSettingsDoc: LocalSettingsDoc | null) => {
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

      setLocalSettingsDoc(newLocalSettingsDoc)

      //#region update all the values of settings in state

      update("expandedKeys", setIsSpellCheckEnabled)
      update("primarySidebarCurrentView", setPrimarySidebarCurrentView)
      update("secondarySidebarCurrentView", setSecondarySidebarCurrentView)
      update("currentEditor", setCurrentEditor)
      update("primarySidebarIsOpen", setPrimarySidebarIsOpen)
      update("secondarySidebarIsOpen", setSecondarySidebarIsOpen)
      update("navigatorSidebarIsOpen", setNavigatorSidebarIsOpen)

      //#endregion
    },
    []
  )

  // Get the local settings for the first time
  useEffect(() => {
    if (isInitialLoad) {
      query.exec().then((newLocalSettingsDoc) => {
        if (!newLocalSettingsDoc) {
          db.local_settings.insert({
            ...defaults,
            userId: currentUser.username,
          })
        }

        updateInternalState(newLocalSettingsDoc)
        setIsInitialLoad(false)
      })
    }
  }, [
    currentUser.username,
    db.local_settings,
    isInitialLoad,
    query,
    updateInternalState,
  ])

  // Set up local settings subscription
  useEffect(() => {
    const subscription = query.$.subscribe((newLocalSettingsDoc) => {
      console.log(newLocalSettingsDoc)
      updateInternalState(newLocalSettingsDoc)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [query.$, updateInternalState])

  /**
   * Updates a setting under the given key with the given value
   *
   * @param key the key of the attribute to be modified. The key can be nested
   * by using the dot syntax, like this: nested.attribute
   *
   * @todo this typing doesn't support nested properties
   */
  const updateLocalSetting = async <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => {
    if (localSettingsDoc === null) {
      throw Error("The localSettingsDoc object is missing")
    }

    try {
      const newDoc = await localSettingsDoc.atomicSet(key, value)
      return newDoc
    } catch (error) {
      // TODO: better error handling
      throw error
    }
  }

  return (
    <LocalSettingsContext.Provider
      value={{
        updateLocalSetting,
        expandedKeys,
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
