import { useCallback, useMemo } from "react"

import { GenericDocument_Discriminated } from "../../types"

import { useContextMenu } from "../ContextMenu"
import { useEditableText } from "../RenamingInput"
import { useDocumentsAPI } from "../CloudDocumentsProvider"

import { DocumentContextMenu } from "./DocumentContextMenu"

export const useDocumentContextMenu = (
  genericDocument: GenericDocument_Discriminated
) => {
  const { renameDocument } = useDocumentsAPI()

  const {
    getContextMenuProps: getBasicContextMenuProps,
    openMenu,
    closeMenu,
    isMenuOpen,
  } = useContextMenu()

  const { startRenaming, getProps: getEditableProps } = useEditableText(
    genericDocument.name,
    (value: string) => {
      renameDocument(genericDocument.identifier, value)
    }
  )

  // TODO: maybe rename to something like get trigger props
  const getContainerProps = useCallback(() => {
    return {
      onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        openMenu(event)
      },
    }
  }, [openMenu])

  const getContextMenuProps = useCallback(
    () => ({
      getContextMenuProps: getBasicContextMenuProps,
      startRenaming,
      closeMenu,
      genericDocument,
    }),
    [closeMenu, genericDocument, getBasicContextMenuProps, startRenaming]
  )

  return useMemo(
    () => ({
      DocumentContextMenu,

      isMenuOpen,
      openMenu,
      closeMenu,

      getEditableProps,
      getContainerProps,
      getContextMenuProps,
    }),
    [
      closeMenu,
      getContainerProps,
      getContextMenuProps,
      getEditableProps,
      isMenuOpen,
      openMenu,
    ]
  )
}

// =======================================================

// export const useDocumentContextMenu = (document: DocumentDoc) => {
//   const { renameDocument } = useDocumentsAPI()

//   const {
//     getContextMenuProps: getBasicContextMenuProps,
//     openMenu,
//     closeMenu,
//     isMenuOpen,
//   } = useContextMenu()

//   const { startRenaming, getProps: getEditableProps } = useEditableText(
//     document.title,
//     (value: string) => {
//       renameDocument(document.id, value)
//     }
//   )

//   // TODO: maybe rename to something like get trigger props
//   const getContainerProps = useCallback(() => {
//     return {
//       onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
//         event.stopPropagation()
//         openMenu(event)
//       },
//     }
//   }, [openMenu])

//   const memoizedDocumentFragment: DocumentContextMenuPropsDocumentFragment =
//     useMemo(
//       () => ({
//         id: document.id,
//         title: document.title,
//         content: document.content,
//         parentGroup: document.parentGroup,
//         modifiedAt: document.modifiedAt,
//         isFavorite: document.isFavorite,
//         isDeleted: document.isDeleted,
//       }),
//       [
//         document.content,
//         document.id,
//         document.isDeleted,
//         document.isFavorite,
//         document.modifiedAt,
//         document.parentGroup,
//         document.title,
//       ]
//     )

//   const getContextMenuProps = useCallback(
//     () => ({
//       getContextMenuProps: getBasicContextMenuProps,
//       startRenaming,
//       closeMenu,
//       document: memoizedDocumentFragment,
//     }),
//     [
//       closeMenu,
//       getBasicContextMenuProps,
//       memoizedDocumentFragment,
//       startRenaming,
//     ]
//   )

//   return useMemo(
//     () => ({
//       DocumentContextMenu,

//       isMenuOpen,
//       openMenu,
//       closeMenu,

//       getEditableProps,
//       getContainerProps,
//       getContextMenuProps,
//     }),
//     [
//       closeMenu,
//       getContainerProps,
//       getContextMenuProps,
//       getEditableProps,
//       isMenuOpen,
//       openMenu,
//     ]
//   )
// }
