import React, { useCallback, useMemo } from "react"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { useMainState } from "../MainProvider"
import { TreeItem } from "../TreeItem"
import { formatOptional } from "../../utils"
import { useDocumentContextMenu } from "../DocumentContextMenu"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: string
}> = ({ document, depth = 0, icon }) => {
  const { openDocument } = useMainState()

  const {
    openMenu,
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
  } = useDocumentContextMenu(document)

  // TODO: consider extracting the specific document renaming logic into another hook

  const title = useMemo(() => formatOptional(document.title, "Untitled"), [
    document.title,
  ])

  const handleClick = useCallback(() => {
    openDocument(document.id)
  }, [document.id, openDocument])

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    openMenu(event)
  }

  return (
    <>
      <TreeItem
        depth={depth}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        icon={icon}
      >
        <EditableText {...getEditableProps()}>{title}</EditableText>
      </TreeItem>

      {isMenuOpen && <DocumentContextMenu />}
    </>
  )
}

export default DocumentTreeItem
