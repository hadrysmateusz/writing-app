import { useCallback } from "react"

import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../ContextMenu/New"
import { usePrimarySidebar } from "../../../ViewState"

import SectionHeaderComponent from "../SectionHeaderComponent"

export const LocalDocumentSectionHeader: React.FC<{
  path: string
  isOpen: boolean
  onToggle: () => void
  removeDir: (path: string) => void

  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({
  path,
  children,
  removeDir,
  isOpen,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { switchSubview } = usePrimarySidebar()

  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleRemoveDir = useCallback(
    (_e) => {
      removeDir(path)
    },
    [path, removeDir]
  )

  const handleClick = () => {
    switchSubview("local", "directory", path)
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    openMenu(e)
  }

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
          <ContextMenuItem onClick={handleRemoveDir}>
            Remove Directory
          </ContextMenuItem>
        </ContextMenu>
      ) : null}
    </>
  )
}