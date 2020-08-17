import React, { useCallback } from "react"

import { TreeItem } from "../TreeItem"

import { useModal } from "../Modal"
import { ImportModalContent } from "../Importer"

export const SidebarImportButton: React.FC = () => {
  const { open: openImportModal, Modal: ImportModal } = useModal(false)

  const handleImport = useCallback(() => {
    openImportModal()
  }, [openImportModal])

  return (
    <>
      <TreeItem icon="import" onClick={handleImport} depth={0}>
        Import
      </TreeItem>
      <ImportModal
        render={({ close }) => <ImportModalContent close={close} />}
      />
    </>
  )
}
