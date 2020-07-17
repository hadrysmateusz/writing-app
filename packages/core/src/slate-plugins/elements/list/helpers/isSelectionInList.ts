import { Editor } from "slate"

import { isBlockActive } from "../../../../slate-helpers"
import { ListType } from "../../../../slateTypes"

export const isSelectionInList = (editor: Editor): boolean =>
  isBlockActive(editor, ListType.LIST_ITEM)
