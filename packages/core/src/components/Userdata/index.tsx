import React, { useState, useEffect, useMemo, useCallback } from "react"
import createContext from "../../utils/createContext"
import { UserSettings, useDatabase, UserdataDoc } from "../Database"
import { useCurrentUser } from "../Auth"

export type UserdataState = {
  // settings: UserSettings
}

export const [useUserdata, _, UserdataContext] = createContext<UserdataState>()

export const UserdataProvider: React.FC = ({ children }) => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    return true
  })

  /**
   * RxDB document containing the userdata
   */
  const [userdataDoc, setUserdataDoc] = useState<UserdataDoc | null>(null)
  // /**
  //  * Only the actual userdata doc content
  //  */
  // const [userdata, setUserdata] = useState<RxDocumentTypeWithRev<
  //   UserdataDocType
  // > | null>()

  //#region values of the actual userdata - separated to optimize rerendering

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState<
    UserSettings["isSpellCheckEnabled"]
  >(true)

  //#endregion

  const query = useMemo(() => db.userdata.findOne(currentUser.username), [
    currentUser.username,
    db.userdata,
  ])

  const updateInternalState = useCallback(
    (newUserdataDoc: UserdataDoc | null) => {
      const data = newUserdataDoc?.toJSON()

      const conditionallyUpdate = <K extends keyof UserSettings>(
        key: K,
        updater: React.Dispatch<React.SetStateAction<UserSettings[K]>>
      ) => {
        const value = data?.[key]
        if (value === undefined) return
        updater(value)
      }

      setUserdataDoc(newUserdataDoc)

      //#region update all the values of settings in state

      conditionallyUpdate("isSpellCheckEnabled", setIsSpellCheckEnabled)

      //#endregion
    },
    []
  )

  // get the userdata for the first time
  useEffect(() => {
    if (isInitialLoad) {
      query.exec().then((newUserdataDoc) => {
        updateInternalState(newUserdataDoc)
        setIsInitialLoad(false)
      })
    }
  }, [isInitialLoad, query, updateInternalState])

  // set up userdata subscription
  useEffect(() => {
    const subscription = query.$.subscribe((newUserdataDoc) => {
      updateInternalState(newUserdataDoc)
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
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (userdataDoc === null) {
      // TODO: better error handling
      throw Error("The userdataDoc object is missing")
    }

    try {
      const newDoc = await userdataDoc.atomicSet(key, value)
      return newDoc
    } catch (error) {
      // TODO: better error handling
      throw error
    }
  }

  return (
    <UserdataContext.Provider value={{ isSpellCheckEnabled, updateSetting }}>
      {isInitialLoad ? null : children}
    </UserdataContext.Provider>
  )
}
