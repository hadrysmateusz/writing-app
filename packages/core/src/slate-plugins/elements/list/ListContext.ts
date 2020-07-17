import createContext from "../../../utils/createContext"

export const [useListContext, ListContextProvider] = createContext<{
  listLevel: number
}>()
