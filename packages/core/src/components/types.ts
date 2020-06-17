import { DocumentDoc, DocumentDocType, GroupDoc } from "./Database"

// Documents

export type NewDocumentFn = (
  shouldSwitch: boolean,
  parentGroup: string | null
) => Promise<DocumentDoc>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type RemoveDocumentFn = (documentId: string) => Promise<void>

export type RestoreDocumentFn = (documentId: string) => Promise<DocumentDoc>

export type MoveDocumentToGroupFn = (
  documentId: string,
  title: string
) => Promise<DocumentDoc>

export type ToggleDocumentFavoriteFn = (
  documentId: string
) => Promise<DocumentDoc>

export type UpdateCurrentDocumentFn = (
  newValues: Partial<DocumentDocType>
) => Promise<DocumentDocType>

export type SaveDocumentFn = () => Promise<DocumentDocType | null>

export type SwitchDocumentFn = (documentId: string | null) => void

// Groups

export type NewGroupFn = (parentGroup: string | null) => Promise<GroupDoc>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>
