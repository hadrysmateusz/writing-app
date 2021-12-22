import React, { useCallback, useMemo } from "react"

import { formatOptional } from "../../utils"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { GenericTreeItem } from "../TreeItem"
import { useDocumentContextMenu } from "../DocumentContextMenu"
import { useTabsAPI } from "../TabsProvider"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: string
}> = ({ document, depth = 0, icon }) => {
  const { openDocument } = useTabsAPI()

  const {
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
    getContainerProps,
    getContextMenuProps,
  } = useDocumentContextMenu(document)

  // TODO: consider extracting the specific document renaming logic into another hook

  const title = useMemo(
    () => formatOptional(document.title, "Untitled"),
    [document.title]
  )

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
      {isMenuOpen ? <DocumentContextMenu {...getContextMenuProps()} /> : null}
    </>
  )
}

export default DocumentTreeItem
