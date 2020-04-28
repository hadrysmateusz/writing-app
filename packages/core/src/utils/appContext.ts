import createContext from "./createContext"

export const [useAppContext, AppContextProvider] = createContext<{
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}>()
