import { ContextMenuProps } from "../ContextMenu"
import { DocumentDoc } from "../Database"

export type DocumentContextMenuProps = {
  document: DocumentDoc

  startRenaming: () => void
  getContextMenuProps: () => ContextMenuProps
  closeMenu: () => void
}

// export type DocumentContextMenuPropsDocumentFragment = Pick<
//   DocumentDoc,
//   | "id"
//   | "modifiedAt"
//   | "isFavorite"
//   | "isDeleted"
//   | "content"
//   | "title"
//   | "parentGroup"
// >
