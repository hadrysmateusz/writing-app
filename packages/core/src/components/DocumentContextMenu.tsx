import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components/macro"

import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
  ContextMenuSeparator,
} from "./ContextMenu"
import { DocumentDoc } from "./Database"
import { useEditableText } from "./RenamingInput"
import { useMainState } from "./MainProvider"
import { formatOptional } from "./../utils"
import { useDocumentsAPI } from "./MainProvider"

export const useDocumentContextMenu = (document: DocumentDoc) => {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false)
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { groups } = useMainState()
  const {
    removeDocument,
    renameDocument,
    moveDocumentToGroup,
    toggleDocumentFavorite,
    restoreDocument,
    permanentlyRemoveDocument,
  } = useDocumentsAPI()

  const { startRenaming, getProps: getEditableProps } = useEditableText(
    document.title,
    (value: string) => {
      renameDocument(document.id, value)
    }
  )

  const modifiedAt = useMemo(() => {
    // TODO: replace with proper representation (using moment.js)
    return new Date(Number(document.modifiedAt)).toLocaleDateString()
  }, [document.modifiedAt])

  const handleRemoveDocument = useCallback(() => {
    removeDocument(document.id)
  }, [document.id, removeDocument])

  const handleRestoreDocument = useCallback(() => {
    restoreDocument(document.id)
  }, [document.id, restoreDocument])

  const handlePermanentlyRemoveDocument = useCallback(() => {
    permanentlyRemoveDocument(document.id)
  }, [document.id, permanentlyRemoveDocument])

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleToggleDocumentFavorite = useCallback(async () => {
    closeMenu()
    setIsLoadingFavorite(true)
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

  // const isCurrent = useMemo(() => {
  //   // TODO: something doesn't work here
  //   if (currentDocument === null) return false
  //   return document.id === currentDocument.id
  // }, [currentDocument, document.id])

  const DocumentContextMenu: React.FC<{}> = () => {
    return (
      <ContextMenu>
        {!document.isDeleted ? (
          <>
            <ContextMenuItem onClick={handleRenameDocument}>
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={handleToggleDocumentFavorite}
              disabled={isLoadingFavorite}
            >
              {document.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"}
            </ContextMenuItem>
            <ContextMenuItem onClick={handleRemoveDocument}>
              Delete
            </ContextMenuItem>

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
          </>
        ) : (
          <>
            <ContextMenuItem onClick={handleRestoreDocument}>
              Restore
            </ContextMenuItem>
            <ContextMenuItem onClick={handlePermanentlyRemoveDocument}>
              Delete permanently
            </ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMeta>
              <span>Last edited</span> {modifiedAt}
            </ContextMeta>
          </>
        )}
      </ContextMenu>
    )
  }

  return {
    DocumentContextMenu,
    isMenuOpen,
    openMenu,
    closeMenu,
    getEditableProps,
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
  cursor: default;
`
