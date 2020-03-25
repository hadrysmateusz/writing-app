import { Editor } from "slate"
import { isBlockActive } from "../../../../slate-helpers"
import { ListType } from "../types"

export const isSelectionInList = (editor: Editor): boolean =>
	isBlockActive(editor, ListType.LIST_ITEM)
