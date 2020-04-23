import createContext from "./createContext"

export const [useAppContext, AppContextProvider] = createContext<{
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  currentDocument: string | null
  setCurrentDocument: React.Dispatch<React.SetStateAction<string | null>>
}>()
