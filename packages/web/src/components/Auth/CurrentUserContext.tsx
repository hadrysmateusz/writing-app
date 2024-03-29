import React from "react"

import { useAuthContext } from "./Auth"
import { CurrentUser } from "./types"
import createContext from "../../utils/createContext"

const isCurrentUser = (value: any): value is CurrentUser => {
  // The null check is required because of a bug that makes typeof null be "object"
  return typeof value === "object" && value !== null
}

/*
useCurrentUser always returns the current user object. Only available within authenticated routes
*/
const [CurrentUserContext, useCurrentUser] = createContext<CurrentUser>()

const CurrentUserProvider: React.FC = ({ children }) => {
  const { currentUser } = useAuthContext()

  return isCurrentUser(currentUser) ? (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  ) : null
}

export { useCurrentUser, CurrentUserProvider, CurrentUserContext }
