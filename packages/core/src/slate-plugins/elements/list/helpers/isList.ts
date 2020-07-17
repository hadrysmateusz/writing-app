import { Node } from "slate"
import { ListType } from "../../../../slateTypes"

export const isList = (n: Node) =>
  [ListType.OL_LIST, ListType.UL_LIST].includes(n.type)
