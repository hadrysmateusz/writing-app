import { createContext } from "../../utils"

export const [ContextMenuContext, useContextMenuContext] = createContext<{
  parentMenuContainerRef: React.MutableRefObject<HTMLDivElement | null>
}>()
