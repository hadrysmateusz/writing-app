import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../ContextMenu"
import { useDocumentsAPI } from "../../../CloudDocumentsProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"
import { useCallback } from "react"

/**
 * Section header for cloud document lists
 *
 * TODO: eventually rename this to CloudDocumentsSectionHeader or sth
 */
export const CloudDocumentSectionHeader: React.FC<{
  groupId?: string | null
  isOpen: boolean
  onToggle: () => void

  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ groupId, onToggle, isOpen, children, onMouseEnter, onMouseLeave }) => {
  const { switchSubview } = usePrimarySidebar()
  const { createDocument } = useDocumentsAPI()

  const { getContextMenuProps, openMenu, closeMenu, isMenuOpen } =
    useContextMenu()

  const handleNewDocument = useCallback(() => {
    if (groupId !== undefined) {
      createDocument({ parentGroup: groupId })
    }
    closeMenu() // TODO: this is probably redundant
  }, [closeMenu, createDocument, groupId])

  const handleClick = useCallback(() => {
    if (typeof groupId === "string") {
      switchSubview("cloud", "group", groupId)
    }
  }, [groupId, switchSubview])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (groupId === undefined) return
      openMenu(e)
    },
    [groupId, openMenu]
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