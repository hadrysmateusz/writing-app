import createContext from "../utils/createContext"

export const [useAuthContext, AuthContextProvider] = createContext<{
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}>()
