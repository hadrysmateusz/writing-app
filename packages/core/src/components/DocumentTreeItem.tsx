import React, { useCallback, useMemo, useState } from "react"

import { useContextMenu, ContextMenuItem, ContextSubmenu } from "./ContextMenu2"
import { DocumentDoc } from "./Database"
import { useEditableText, EditableText } from "./RenamingInput"
import { useMainState } from "./MainStateProvider"
import TreeItem from "./TreeItem"

const DocumentTreeItem: React.FC<{
  document: DocumentDoc
  depth?: number
  icon?: string
}> = ({ document, depth = 0, icon }) => {
  const {
    groups,
    currentDocument,
    switchDocument,
    renameDocument,
    moveDocumentToGroup,
    toggleDocumentFavorite,
  } = useMainState()
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  // TODO: extract favoriting logic to a hook (or all document context-menu related logic)
  // TODO: consider extracting the specific document renaming logic into another hook
  const { startRenaming, getProps } = useEditableText(
    document.title,
    (value: string) => {
      renameDocument(document.id, value)
    }
  )
  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false)
  const handleToggleDocumentFavorite = useCallback(async () => {
    closeMenu()
    setIsLoadingFavorite(true)
    await toggleDocumentFavorite(document.id)
    setIsLoadingFavorite(false)
  }, [closeMenu, document.id, toggleDocumentFavorite])

  const title = useMemo(() => {
    return document.title.trim() === "" ? "Untitled" : document.title
  }, [document.title])

  const isCurrent = useMemo(() => {
    // TODO: something doesn't work here
    if (currentDocument === null) return false
    return document.id === currentDocument.id
  }, [currentDocument, document.id])

  const removeDocument = useCallback(() => {
    document.remove()
    if (isCurrent) {
      switchDocument(null)
    }
  }, [document, isCurrent, switchDocument])

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

  const moveToGroup = useCallback(
    (groupId: string) => {
      // TODO: consider adding a way to move it to root
      moveDocumentToGroup(document.id, groupId)
    },
    [document.id, moveDocumentToGroup]
  )

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
        <EditableText {...getProps()}>{title}</EditableText>
      </TreeItem>

      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleToggleDocumentFavorite}
            disabled={isLoadingFavorite}
          >
            {/* <Icon icon={document.isFavorite ? "starFilled" : "starOutline"} /> */}
            {document.isFavorite ? "Remove from favorites" : "Add to favorites"}
          </ContextMenuItem>
          <ContextMenuItem onClick={removeDocument}>Delete</ContextMenuItem>
          <ContextSubmenu text="Move to">
            {groups.map((group) => (
              <ContextMenuItem
                key={group.id}
                onClick={() => moveToGroup(group.id)}
              >
                {group.name.trim() === "" ? "Unnamed Collection" : group.name}
                {/* {formatOptional(group.name, "Unnamed Collection")} */}
              </ContextMenuItem>
            ))}
          </ContextSubmenu>
        </ContextMenu>
      )}
    </>
  )
}

export default DocumentTreeItem
