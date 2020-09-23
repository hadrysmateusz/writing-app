import React, { useState, useEffect, useMemo, useCallback } from "react"
import createContext from "../../utils/createContext"
import { UserSettings, useDatabase, UserdataDoc } from "../Database"
import { useCurrentUser } from "../Auth"
import defaultUserdata from "./default"

export type UserdataState = UserSettings & {
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => Promise<UserdataDoc>
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

  //#region values of the actual userdata - separated to optimize rerendering

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState<
    UserSettings["isSpellCheckEnabled"]
  >(defaultUserdata.isSpellCheckEnabled)

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
        if (!newUserdataDoc) {
          throw new Error("The userdataDoc object is missing")
        }

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
      /*
        TODO: better error handling

        TODO: consider splitting sensitive userdata from non-sensitive userdata - this would make it possible to only allow the server to modify the sensitive stuff and prevent issues where code for changing settings can be used to modify subscription status etc. - This data could even be stored in a simpler database like dynamoDb and shouldn't be replicated (although that might cause issues with offline capabilities)

        Consider doing the following:

        If the userdataDoc is null use the defaultUserdata object, apply the 
        correct modifications and instead of atomicSet, simply insert it into the database

        Consider using upsert or atomicUpsert as well
      */
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
