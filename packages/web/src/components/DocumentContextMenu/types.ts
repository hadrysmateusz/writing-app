import { ContextMenuProps } from "../ContextMenu"
import { DocumentDoc } from "../Database"

export type DocumentContextMenuPropsDocumentFragment = Pick<
  DocumentDoc,
  | "id"
  | "modifiedAt"
  | "isFavorite"
  | "isDeleted"
  | "content"
  | "title"
  | "parentGroup"
>

export type DocumentContextMenuProps = {
  document: DocumentContextMenuPropsDocumentFragment

  startRenaming: () => void
  getContextMenuProps: () => ContextMenuProps
  closeMenu: () => void
}
