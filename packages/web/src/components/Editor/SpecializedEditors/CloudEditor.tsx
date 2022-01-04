import { useCallback, useMemo } from "react"

import { createGenericDocumentFromCloudDocument } from "../../../helpers"

import TrashBanner from "../../TrashBanner"
import { useEditorState } from "../../EditorStateProvider"
import { useDocumentsAPI } from "../../CloudDocumentsProvider"
import { useTabsState } from "../../TabsProvider"

import { DocumentEmptyState, DocumentLoadingState } from "../HelperStates"
import EditorComponent from "../EditorComponent"

// TODO: probably remove dependence on currentDocumentId prop
export const CloudEditor: React.FC<{ currentDocumentId: string }> = ({
  currentDocumentId,
}) => {
  const { saveDocument } = useEditorState()
  const { renameDocument } = useDocumentsAPI()
  const { currentCloudDocument, isLoadingCurrentCloudDocument } = useTabsState()

  const handleRename = useCallback(
    (value: string) => {
      renameDocument(currentDocumentId, value)
    },
    [currentDocumentId, renameDocument]
  )

  const genericDocument = useMemo(
    () =>
      currentCloudDocument
        ? createGenericDocumentFromCloudDocument(currentCloudDocument)
        : null,
    [currentCloudDocument]
  )

  return genericDocument && currentCloudDocument ? (
    <>
      {currentCloudDocument.isDeleted && (
        <TrashBanner documentId={currentCloudDocument.id} />
      )}
      <EditorComponent
        saveDocument={saveDocument}
        renameDocument={handleRename}
        genericDocument={genericDocument}
      />
    </>
  ) : isLoadingCurrentCloudDocument ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

export default CloudEditor
