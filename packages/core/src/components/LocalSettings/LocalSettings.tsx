import React, { useState, useEffect, useMemo, useCallback } from "react"
import createContext from "../../utils/createContext"
import { useDatabase, LocalSettingsDoc, LocalSettings } from "../Database"
import { useCurrentUser } from "../Auth"
import defaultLocalSettings from "./default"

export type LocalSettingsState = LocalSettings & {
  updateSetting: <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => Promise<LocalSettingsDoc>
}

export const [useLocalSettings, _, LocalSettingsContext] = createContext<
  LocalSettingsState
>()

// TODO: it might actually be better to replace the RxDB collection with something else (maybe not localStorage because I would probably have to handle encoding and decoding myself but maybe some localStorage abstraction hook with support for more data types or a simpler IndexedDB wrapper. But I should keep bundle size in mind)
export const LocalSettingsProvider: React.FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    return true
  })

  /**
   * RxDB document containing the local settings
   */
  const [
    localSettingsDoc,
    setLocalSettingsDoc,
  ] = useState<LocalSettingsDoc | null>(null)

  //#region values of the actual local settings - separated to optimize rerendering

  const [expandedKeys, setIsSpellCheckEnabled] = useState<
    LocalSettings["expandedKeys"]
  >(defaultLocalSettings.expandedKeys)

  //#endregion

  const query = useMemo(() => db.local_settings.findOne(currentUser.username), [
    currentUser.username,
    db.local_settings,
  ])

  const updateInternalState = useCallback(
    (newLocalSettingsDoc: LocalSettingsDoc | null) => {
      const data = newLocalSettingsDoc?.toJSON()

      const conditionallyUpdate = <K extends keyof LocalSettings>(
        key: K,
        updater: React.Dispatch<React.SetStateAction<LocalSettings[K]>>
      ) => {
        const value = data?.[key]
        if (value === undefined) return
        updater(value)
      }

      setLocalSettingsDoc(newLocalSettingsDoc)

      //#region update all the values of settings in state

      conditionallyUpdate("expandedKeys", setIsSpellCheckEnabled)

      //#endregion
    },
    []
  )

  // get the local settings for the first time
  useEffect(() => {
    if (isInitialLoad) {
      query.exec().then((newLocalSettingsDoc) => {
        updateInternalState(newLocalSettingsDoc)
        setIsInitialLoad(false)
      })
    }
  }, [isInitialLoad, query, updateInternalState])

  // set up local settings subscription
  useEffect(() => {
    const subscription = query.$.subscribe((newLocalSettingsDoc) => {
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
  const updateSetting = async <K extends keyof LocalSettings>(
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
    <LocalSettingsContext.Provider value={{ expandedKeys, updateSetting }}>
      {isInitialLoad ? null : children}
    </LocalSettingsContext.Provider>
  )
}
