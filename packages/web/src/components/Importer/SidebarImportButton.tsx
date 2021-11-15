import React, { useCallback } from "react"

import { GenericTreeItem } from "../TreeItem"

import { useModal } from "../Modal"
import { ImportModalContent } from "../Importer"

export const SidebarImportButton: React.FC = () => {
  const { open: openImportModal, Modal: ImportModal } = useModal<undefined, {}>(
    false,
    {}
  )

  const handleImport = useCallback(() => {
    openImportModal({})
  }, [openImportModal])

  return (
    <>
      <GenericTreeItem icon="import" onClick={handleImport} depth={0}>
        Import
      </GenericTreeItem>
      <ImportModal>{(props) => <ImportModalContent {...props} />}</ImportModal>
    </>
  )
}
