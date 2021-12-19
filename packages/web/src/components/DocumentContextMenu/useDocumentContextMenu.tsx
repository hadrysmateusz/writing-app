import { useCallback, useMemo, useState } from "react"
import styled from "styled-components/macro"

import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
  ContextMenu,
  ContextMenuSeparator,
} from "../ContextMenu"
import { DocumentDoc } from "../Database"
import { useEditableText } from "../RenamingInput"
import { useModal } from "../Modal"
import {
  ExportModalContent,
  ExportModalProps,
  ExportModalReturnValue,
} from "../ExportModal"
import {
  CollectionSelector,
  useCollectionSelector,
} from "../CollectionSelector"
import { Option } from "../Autocomplete"
import { useDocumentsAPI } from "../CloudDocumentsProvider"

export const useDocumentContextMenu = (document: DocumentDoc) => {
  const {
    removeDocument,
    renameDocument,
    // moveDocumentToGroup,
    toggleDocumentFavorite,
    restoreDocument,
    permanentlyRemoveDocument,
    updateDocument,
  } = useDocumentsAPI()

  const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false)

  const { getContextMenuProps, openMenu, closeMenu, isMenuOpen } =
    useContextMenu()

  const { startRenaming, getProps: getEditableProps } = useEditableText(
    document.title,
    (value: string) => {
      renameDocument(document.id, value)
    }
  )

  const { open: openExportModal, Modal: ExportModal } = useModal<
    ExportModalReturnValue,
    ExportModalProps
  >(
    false,
    { documentContent: document.content, documentTitle: document.title },
    {
      onAfterOpen: () => {
        closeMenu()
      },
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

  // const moveToGroup = useCallback(
  //   (groupId: string) => {
  //     // TODO: consider adding a way to move it to root
  //     moveDocumentToGroup(document.id, groupId)
  //   },
  //   [document.id, moveDocumentToGroup]
  // )

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      openMenu(event)
    },
    [openMenu]
  )

  const handleExport = useCallback(() => {
    console.log("open")
    openExportModal({
      documentContent: document.content,
      documentTitle: document.title,
    })
  }, [document.content, document.title, openExportModal])

  const getContainerProps = useCallback(() => {
    return { onContextMenu: handleContextMenu }
  }, [handleContextMenu])

  // const isCurrent = useMemo(() => {
  //   if (currentDocumentId === null) return false
  //   return document.id === currentDocumentId
  // }, [currentDocumentId, document.id])

  // TODO: add item for exporting

  const handleMoveToGroupSubmit = useCallback(
    async (option: Option) => {
      closeMenu()

      const selectedGroupId = option.value

      await updateDocument(document.id, {
        parentGroup: selectedGroupId,
      })
    },
    [closeMenu, document.id, updateDocument]
  )

  const { getCollectionSelectorPropsAndRef } = useCollectionSelector()

  const DocumentContextMenu: React.FC<{}> = () => {
    return (
      <>
        {isMenuOpen ? (
          <ContextMenu
            {...getContextMenuProps()}
            closeAfterClick={false}
            closeOnScroll={false}
          >
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
                <ContextMenuItem onClick={handleExport}>Export</ContextMenuItem>
                <ContextMenuItem onClick={handleRemoveDocument}>
                  Delete
                </ContextMenuItem>

                <ContextMenuSeparator />
                <ContextSubmenu text="Move to">
                  <CollectionSelector
                    onSubmit={handleMoveToGroupSubmit}
                    {...getCollectionSelectorPropsAndRef()}
                    disabledGroupIds={[document.parentGroup]}
                  />
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
        ) : null}

        <ExportModal component={ExportModalContent} />
      </>
    )
  }

  return {
    DocumentContextMenu,
    isMenuOpen,
    openMenu,
    closeMenu,
    getEditableProps,
    getContainerProps,
  }
}

const ContextMeta = styled.div`
  font-weight: 500;
  padding: 6px 20px;
  font-size: 11px;
  color: var(--light-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
`
