import React, { useCallback, useMemo } from "react"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { useMainState } from "../MainProvider"
import { GenericTreeItem } from "../TreeItem"
import { formatOptional } from "../../utils"
import { useDocumentContextMenu } from "../DocumentContextMenu"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: string
}> = ({ document, depth = 0, icon }) => {
  const { openDocument } = useMainState()

  const {
    DocumentContextMenu,
    getEditableProps,
    getContainerProps,
  } = useDocumentContextMenu(document)

  // TODO: consider extracting the specific document renaming logic into another hook

  const title = useMemo(() => formatOptional(document.title, "Untitled"), [
    document.title,
  ])

  const handleClick = useCallback(() => {
    openDocument(document.id)
  }, [document.id, openDocument])

  return (
    <>
      <GenericTreeItem
        depth={depth}
        onClick={handleClick}
        icon={icon}
        {...getContainerProps()}
      >
        <EditableText {...getEditableProps()}>{title}</EditableText>
      </GenericTreeItem>

      <DocumentContextMenu />
    </>
  )
}

export default DocumentTreeItem
