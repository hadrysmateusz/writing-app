import React, { useCallback, useMemo } from "react"

import { useRxSubscription } from "../../hooks"

import { useEditorState } from "../EditorStateProvider"
import { useDatabase } from "../Database"
import { useDocumentsAPI } from "../MainProvider"
import TrashBanner from "../TrashBanner"

import { deserialize } from "./serialization"
import { EditorComponent } from "."
import { DocumentEmptyState, DocumentLoadingState } from "./Editor"

export const CloudEditor: React.FC<{ currentDocumentId: string }> = ({
  currentDocumentId,
}) => {
  const db = useDatabase()
  const { saveDocument } = useEditorState()
  const { renameDocument } = useDocumentsAPI()

  // TODO: maybe make the main state provider use the rx subscription hook
  const {
    data: currentDocument,
    isLoading: isDocumentLoading,
  } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  const content = useMemo(
    () => (currentDocument ? deserialize(currentDocument.content) : []),
    [currentDocument]
  )

  const handleRename = useCallback(
    (value: string) => {
      renameDocument(currentDocumentId, value)
    },
    [currentDocumentId, renameDocument]
  )

  return currentDocument ? (
    <>
      {currentDocument.isDeleted && (
        <TrashBanner documentId={currentDocument.id} />
      )}
      <EditorComponent
        key={currentDocument.id} // Necessary to reload the component on id change
        saveDocument={saveDocument}
        renameDocument={handleRename}
        title={currentDocument.title}
        content={content}
      />
    </>
  ) : isDocumentLoading ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

export default CloudEditor
