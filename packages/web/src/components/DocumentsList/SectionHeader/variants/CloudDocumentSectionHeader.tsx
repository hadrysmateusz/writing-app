import { ContextMenuItem, useContextMenu } from "../../../ContextMenu/Old"
import { useDocumentsAPI } from "../../../CloudDocumentsProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"

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

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()

  const handleNewDocument = () => {
    if (groupId !== undefined) {
      createDocument({ parentGroup: groupId })
    }
    closeMenu()
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (groupId === undefined) return
    openMenu(e)
  }

  const handleClick = () => {
    if (typeof groupId === "string") {
      switchSubview("cloud", "group", groupId)
    }
  }

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

      <ContextMenu>
        <ContextMenuItem onClick={handleNewDocument}>
          New Document
        </ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default CloudDocumentSectionHeader
