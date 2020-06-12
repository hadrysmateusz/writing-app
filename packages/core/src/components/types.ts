import { DocumentDoc, DocumentDocType, GroupDoc } from "./Database"

export type NewDocumentFn = (
  shouldSwitch: boolean,
  parentGroup: string | null
) => Promise<DocumentDoc>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<Document | null>

export type UpdateCurrentDocumentFn = (
  newValues: Partial<DocumentDocType>
) => Promise<DocumentDocType>

export type SaveDocumentFn = () => Promise<DocumentDocType | null>

export type SwitchDocumentFn = (documentId: string | null) => void

export type NewGroupFn = (parentGroup: string | null) => Promise<GroupDoc>
