import React, { useCallback, useMemo } from "react"

import TrashBanner from "../../TrashBanner"
import { useEditorState } from "../../EditorStateProvider"
import { useDocumentsAPI } from "../../CloudDocumentsProvider"
import { useTabsState } from "../../TabsProvider"

import { deserialize } from "../helpers"
import { DocumentEmptyState, DocumentLoadingState } from "../HelperStates"
import EditorComponent from "../EditorComponent"

// TODO: probably remove dependence on currentDocumentId prop
export const CloudEditor: React.FC<{ currentDocumentId: string }> = ({
  currentDocumentId,
}) => {
  const { saveDocument } = useEditorState()
  const { renameDocument } = useDocumentsAPI()
  const { currentCloudDocument, isLoadingCurrentCloudDocument } = useTabsState()

  const content = useMemo(
    () =>
      currentCloudDocument ? deserialize(currentCloudDocument.content) : [],
    [currentCloudDocument]
  )

  const handleRename = useCallback(
    (value: string) => {
      renameDocument(currentDocumentId, value)
    },
    [currentDocumentId, renameDocument]
  )

  return currentCloudDocument ? (
    <>
      {currentCloudDocument.isDeleted && (
        <TrashBanner documentId={currentCloudDocument.id} />
      )}
      <EditorComponent
        key={currentCloudDocument.id} // Necessary to reload the component on id change
        saveDocument={saveDocument}
        renameDocument={handleRename}
        title={currentCloudDocument.title}
        content={content}
      />
    </>
  ) : isLoadingCurrentCloudDocument ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

export default CloudEditor
