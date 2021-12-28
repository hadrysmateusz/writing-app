import { memo, useCallback, useMemo, useState } from "react"

import { useRxSubscription } from "../../hooks"
import { GenericDocument_Discriminated } from "../../types"

import {
  ContextMenuItem,
  ContextSubmenu,
  ContextMenu,
  ContextMenuSeparator,
  ContextMeta,
} from "../ContextMenu"
import { Modal } from "../Modal"
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
import { useDatabase } from "../Database"

import { DocumentContextMenuProps } from "./types"

// TODO: remember to conditioanally render this component (or create and use a conditional rendering HOC)

type DocumentContextMenuLoaderProps = Omit<
  DocumentContextMenuProps,
  "document"
> & {
  genericDocument: GenericDocument_Discriminated
}

const withCloudDocument =
  (
    C: React.FC<DocumentContextMenuProps>
  ): React.FC<DocumentContextMenuLoaderProps> =>
  ({ genericDocument, ...props }) => {
    const db = useDatabase()
    const query = useMemo(
      () => db.documents.findOne().where("id").eq(genericDocument.identifier),
      [db.documents, genericDocument.identifier]
    )
    const { data: document } = useRxSubscription(query)

    return document ? <C {...props} document={document} /> : null
  }

const __DocumentContextMenu: React.FC<DocumentContextMenuProps> = memo(
  ({
    document,

    startRenaming,
    closeMenu,
    getContextMenuProps,
  }) => {
    const {
      removeDocument,
      // moveDocumentToGroup,
      toggleDocumentFavorite,
      restoreDocument,
      permanentlyRemoveDocument,
      updateDocument,
    } = useDocumentsAPI()

    const [isLoadingFavorite, setIsLoadingFavorite] = useState<boolean>(false)

    const { getCollectionSelectorPropsAndRef } = useCollectionSelector()

    const { open: openExportModal, Modal: ExportModal } = Modal.useModal<
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

    const formattedModifiedAt = useMemo(() => {
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

    const handleExport = useCallback(() => {
      openExportModal({
        documentContent: document.content,
        documentTitle: document.title,
      })
    }, [document.content, document.title, openExportModal])

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

    const renderDocumentDeleted = () => {
      return (
        <>
          <ContextMenuItem onClick={handleRestoreDocument}>
            Restore
          </ContextMenuItem>
          <ContextMenuItem onClick={handlePermanentlyRemoveDocument}>
            Delete permanently
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMeta>
            <span>Last edited</span> {formattedModifiedAt}
          </ContextMeta>
        </>
      )
    }

    const renderDefault = () => {
      return (
        <>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleToggleDocumentFavorite}
            disabled={isLoadingFavorite}
          >
            {document.isFavorite ? "Remove from favorites" : "Add to favorites"}
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
            <span>Last edited</span> {formattedModifiedAt}
          </ContextMeta>
        </>
      )
    }

    return (
      <>
        <ContextMenu
          {...getContextMenuProps()}
          closeAfterClick={false}
          closeOnScroll={false}
        >
          {!document.isDeleted ? renderDefault() : renderDocumentDeleted()}
        </ContextMenu>

        <ExportModal component={ExportModalContent} />
      </>
    )
  }
)

export const DocumentContextMenu = withCloudDocument(__DocumentContextMenu)
