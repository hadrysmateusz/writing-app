import { useCallback } from "react"

import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../ContextMenu"
import { useLocalFS } from "../../../LocalFSProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"

export const LocalDocumentSectionHeader: React.FC<{
  path: string
  isOpen: boolean
  onToggle: () => void

  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ path, children, isOpen, onToggle, onMouseEnter, onMouseLeave }) => {
  const { switchSubview } = usePrimarySidebar()
  const { deleteDir } = useLocalFS()

  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleRemoveDir = useCallback(
    (_e) => {
      deleteDir(path)
    },
    [path, deleteDir]
  )

  const handleClick = useCallback(() => {
    switchSubview("local", "directory", path)
  }, [path, switchSubview])

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
        titleTooltip={path}
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
