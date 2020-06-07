import { Document } from "models"
import { DocumentDoc } from "../Database"

export type NewDocumentFn = (
  shouldSwitch: boolean,
  parentGroup: string | null
) => Promise<DocumentDoc | null>

export type RenameDocumentFn = (
  documentId: string,
  title: string
) => Promise<Document | null>

export type SaveDocumentFn = () => Promise<Document | null>

export type SwitchEditorFn = (documentId: string | null) => void
