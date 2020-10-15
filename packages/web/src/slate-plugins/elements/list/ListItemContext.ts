import createContext from "../../../utils/createContext"
import { Node } from "slate"

export const [ListItemContext, useListItemContext] = createContext<{
  listItemDirectNode: Node | null
}>()
