import createContext from "../../../utils/createContext"

export const [ListContext, useListContext] = createContext<{
  listLevel: number
}>()
