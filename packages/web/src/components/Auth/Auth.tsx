import { useState, useCallback, useEffect } from "react"
import { Auth } from "aws-amplify"

import createContext from "../../utils/createContext"

import { CurrentUser } from "./types"

export type AuthState = {
  isAuthenticated: boolean
  currentUser: CurrentUser | null // TODO: figure out better typing
  logout: () => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
}

export const [AuthContext, useAuthContext] = createContext<AuthState>()

export const AuthContextProvider: React.FC = ({ children }) => {
  /**
   * Is the user currently authenticated, access to most routes should be restricted while this is false
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  /**
   * On startup, the current authentication status is checked, until it finishes, nothing else should render
   */
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  /**
   * The current user object, should contain user info when authenticated and null when not
   */
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  /**
   * This function should be called with the new isAuthenticated value ,whenever the auth state should change
   *
   * A wrapper around setIsAuthenticated
   */
  const changeAuthState = useCallback(async (newState: boolean) => {
    if (newState) {
      console.log("logged in")
      const currentUser = await Auth.currentAuthenticatedUser()
      setCurrentUser(currentUser)
    } else {
      console.log("logged out")
      setCurrentUser(null)
    }
    setIsAuthenticated(newState)
  }, [])

  /**
   * Logs in the user.
   *
   * @returns true on success and false on failure
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // TODO: research possible errors and what to do about them
      try {
        await Auth.signIn(email, password)
        changeAuthState(true)
        return true
      } catch (error) {
        console.error(error)
        alert(error.message)
        return false
      }
    },
    [changeAuthState]
  )

  /**
   * Logs out the user.
   *
   * @returns true on success and false on failure
   */
  const logout = useCallback(async (): Promise<boolean> => {
    // TODO: research possible errors and what to do about them
    try {
      await Auth.signOut()
      changeAuthState(false)
      return true
    } catch (error) {
      console.error(error)
      alert(error.message)
      return false
    }
  }, [changeAuthState])

  useEffect(() => {
    ;(async () => {
      try {
        // TODO: reexamine the auth logic
        await Auth.currentSession()
        changeAuthState(true)
      } catch (error) {
        changeAuthState(false)
        // This error means that there is no current user - the user will be shown a login form, so there is no need to display the error
        if (error !== "No current user") {
          alert(error)
        }
      }
      setIsAuthenticating(false)
    })()
  }, [changeAuthState])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, logout, login }}
    >
      {isAuthenticating ? null : children}
    </AuthContext.Provider>
  )
}
