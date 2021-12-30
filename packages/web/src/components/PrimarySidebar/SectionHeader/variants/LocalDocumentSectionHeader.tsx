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
  const { deleteDir } = useLocalFS()

  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleRemoveDir = useCallback(
    (_e) => {
      if (!identifier) {
        return
      }
      deleteDir(identifier)
    },
    [identifier, deleteDir]
  )

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
          {/* TODO: add option to create new file */}
          <ContextMenuItem onClick={handleRemoveDir}>
            Remove Directory
          </ContextMenuItem>
        </ContextMenu>
      ) : null}
    </>
  )
}
