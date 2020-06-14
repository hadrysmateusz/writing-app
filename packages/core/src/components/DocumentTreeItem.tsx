import React, { useCallback, useMemo } from "react"

import { DocumentDoc } from "./Database"
import { EditableText } from "./RenamingInput"
import { useMainState } from "./MainStateProvider"
import TreeItem from "./TreeItem"
import { formatOptional } from "../utils"
import { useDocumentContextMenu } from "./DocumentContextMenu"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: string
}> = ({ document, depth = 0, icon }) => {
  const { switchDocument } = useMainState()

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

  const openDocument = useCallback(() => {
    switchDocument(document.id)
  }, [document.id, switchDocument])

  const handleClick = useCallback(() => {
    openDocument()
  }, [openDocument])

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    openMenu(event)
  }

  return (
    // <MainContainer onClick={handleClick} isCurrent={isCurrent}>
    //   <Meta>{groupName}</Meta>
    //   <Title>
    //     <EditableText {...getProps()}>{title}</EditableText>
    //   </Title>
    //   <Snippet>{snippet}</Snippet>
    //   <Meta>{modifiedAt}</Meta>
    // </MainContainer>

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
