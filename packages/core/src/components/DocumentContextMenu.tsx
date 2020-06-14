import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components/macro"

import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
  ContextMenuSeparator,
} from "./ContextMenu2"
import { DocumentDoc } from "./Database"
import { useEditableText } from "./RenamingInput"
import { useMainState } from "./MainStateProvider"
import { formatOptional } from "./../utils"

export const useDocumentContextMenu = (document: DocumentDoc) => {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false)
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const {
    groups,
    currentDocument,
    switchDocument,
    renameDocument,
    moveDocumentToGroup,
    toggleDocumentFavorite,
  } = useMainState()
  const { startRenaming, getProps: getEditableProps } = useEditableText(
    document.title,
    (value: string) => {
      renameDocument(document.id, value)
    }
  )

  const isCurrent = useMemo(() => {
    // TODO: something doesn't work here
    if (currentDocument === null) return false
    return document.id === currentDocument.id
  }, [currentDocument, document.id])

  const modifiedAt = useMemo(() => {
    // TODO: replace with proper representation (using moment.js)
    return new Date(Number(document.modifiedAt)).toLocaleDateString()
  }, [document.modifiedAt])

  const removeDocument = useCallback(() => {
    document.remove()
    if (isCurrent) {
      switchDocument(null)
    }
  }, [document, isCurrent, switchDocument])

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleToggleDocumentFavorite = useCallback(async () => {
    closeMenu()
    setIsLoadingFavorite(true)
    console.log("favoriting")
    await toggleDocumentFavorite(document.id)
    setIsLoadingFavorite(false)
  }, [closeMenu, document.id, toggleDocumentFavorite])

  const moveToGroup = useCallback(
    (groupId: string) => {
      // TODO: consider adding a way to move it to root
      moveDocumentToGroup(document.id, groupId)
    },
    [document.id, moveDocumentToGroup]
  )

  const DocumentContextMenu: React.FC<{}> = () => {
    return (
      <ContextMenu>
        <ContextMenuItem onClick={handleRenameDocument}>Rename</ContextMenuItem>
        <ContextMenuItem
          onClick={handleToggleDocumentFavorite}
          disabled={isLoadingFavorite}
        >
          {document.isFavorite ? "Remove from favorites" : "Add to favorites"}
        </ContextMenuItem>
        <ContextMenuItem onClick={removeDocument}>Delete</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextSubmenu text="Move to">
          {groups.map((group) => (
            <ContextMenuItem
              key={group.id}
              onClick={() => moveToGroup(group.id)}
            >
              {formatOptional(group.name, "Unnamed Collection")}
            </ContextMenuItem>
          ))}
        </ContextSubmenu>
        <ContextMenuSeparator />
        <ContextMeta>
          <span>Last edited</span> {modifiedAt}
        </ContextMeta>
      </ContextMenu>
    )
  }

  return {
    DocumentContextMenu,
    openMenu,
    closeMenu,
    getEditableProps,
    isMenuOpen,
  }
}

const ContextMeta = styled.div`
  font-weight: 500;
  padding: 6px 20px;
  font-size: 11px;
  color: #717171;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`
