import { useCallback } from "react"

import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../ContextMenu"
import { useDocumentsAPI } from "../../../CloudDocumentsProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"

export type CloudDocumentSectionHeaderProps = {
  identifier?: string | null
  isOpen: boolean
  onToggle: () => void

  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * Section header for cloud document lists
 */
export const CloudDocumentSectionHeader: React.FC<
  CloudDocumentSectionHeaderProps
> = ({
  identifier,
  onToggle,
  isOpen,
  children,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { switchSubview } = usePrimarySidebar()
  const { createDocument } = useDocumentsAPI()

  const { getContextMenuProps, openMenu, closeMenu, isMenuOpen } =
    useContextMenu()

  const handleNewDocument = useCallback(() => {
    if (identifier !== undefined) {
      createDocument({ parentGroup: identifier })
    }
    closeMenu() // TODO: this is probably redundant
  }, [closeMenu, createDocument, identifier])

  const handleClick = useCallback(() => {
    if (typeof identifier === "string") {
      switchSubview("cloud", "group", identifier)
    }
  }, [identifier, switchSubview])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (identifier === undefined) return
      openMenu(e)
    },
    [identifier, openMenu]
  )

  return (
    <>
      <SectionHeaderComponent
        isOpen={isOpen}
        titleTooltip="Go to collection"
        togglerTooltip={`${isOpen ? "Collapse" : "Expand"} collection`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onToggle={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </SectionHeaderComponent>

      {isMenuOpen ? (
        <ContextMenu {...getContextMenuProps()}>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
        </ContextMenu>
      ) : null}
    </>
  )
}

export default CloudDocumentSectionHeader
