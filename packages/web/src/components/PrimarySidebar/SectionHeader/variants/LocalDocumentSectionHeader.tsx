import { useCallback } from "react"

import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../ContextMenu"
import { useLocalFS } from "../../../LocalFSProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"

export type LocalDocumentSectionHeaderProps = {
  identifier?: string | null
  isOpen: boolean
  onToggle: () => void

  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const LocalDocumentSectionHeader: React.FC<
  LocalDocumentSectionHeaderProps
> = ({
  identifier,
  children,
  isOpen,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { switchSubview } = usePrimarySidebar()
  const { revealItem } = useLocalFS()

  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleClick = useCallback(() => {
    if (!identifier) {
      return
    }
    switchSubview("local", "directory", identifier)
  }, [identifier, switchSubview])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      openMenu(e)
    },
    [openMenu]
  )

  const handleReveal = useCallback(() => {
    if (!identifier) {
      return
    }

    revealItem(identifier)
  }, [identifier, revealItem])

  // const handleRenameItem = useCallback(() => {
  //   closeMenu()
  //   startRenaming()
  // }, [closeMenu, startRenaming])

  // const handleCreateDocument = useCallback(() => {
  //   createDocument()
  // }, [createDocument])

  // const handleCreateItem = useCallback(() => {
  //   setIsCreatingGroup(true)
  // }, [setIsExpanded])

  return (
    <>
      <SectionHeaderComponent
        isOpen={isOpen}
        titleTooltip={identifier ?? "Unknown path"}
        togglerTooltip={`${isOpen ? "Collapse" : "Expand"} directory`}
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
          {/* TODO: remove duplication with GroupingItemTreeItemComponent */}
          {/* <ContextSubmenu text="Create New">
            <ContextMenuItem onClick={handleCreateDocument}>
              File
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCreateItem}>Folder</ContextMenuItem>
          </ContextSubmenu> */}

          {/* <ContextMenuSeparator /> */}

          <ContextMenuItem onClick={handleReveal}>
            Reveal in Explorer
          </ContextMenuItem>
          {/* <ContextMenuItem onClick={handleRenameItem}>Rename</ContextMenuItem> */}
        </ContextMenu>
      ) : null}
    </>
  )
}
