import createContext from "../../../utils/createContext"
import { Node } from "slate"

export const [useListItemContext, ListItemContextProvider] = createContext<{
  listItemDirectNode: Node | null
}>()
