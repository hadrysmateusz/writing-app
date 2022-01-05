import React, { useCallback, useMemo } from "react"

import { formatOptional } from "../../utils"
import { createGenericDocumentFromCloudDocument } from "../../helpers"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { GenericTreeItem } from "../TreeItem"
import { useDocumentContextMenu } from "../DocumentContextMenu"
import { useTabsAPI } from "../TabsProvider"
import { IconNames } from "../Icon"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: IconNames
}> = ({ document, depth = 0, icon }) => {
  const { openDocument } = useTabsAPI()

  // TODO: probably move the entire tree logic to the new generic document system
  const genericDocument = createGenericDocumentFromCloudDocument(document)

  const {
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
    getContainerProps,
    getContextMenuProps,
  } = useDocumentContextMenu(genericDocument)

  // TODO: consider extracting the specific document renaming logic into another hook

  const title = useMemo(
    () => formatOptional(genericDocument.name, "Untitled"),
    [genericDocument.name]
  )

  const handleClick = useCallback(() => {
    openDocument(genericDocument.identifier)
  }, [genericDocument.identifier, openDocument])

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
