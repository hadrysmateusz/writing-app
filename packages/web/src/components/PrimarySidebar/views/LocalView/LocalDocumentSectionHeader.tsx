import { useCallback } from "react"

import SectionHeaderComponent from "../../../DocumentsList/SectionHeaderComponent"
import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../NewContextMenu"
import { usePrimarySidebar } from "../../../ViewState"

export const LocalDocumentSectionHeader: React.FC<{
  path: string
  isOpen: boolean
  onToggle: () => void
  removeDir: (path: string) => void
}> = ({ path, children, removeDir, isOpen, onToggle }) => {
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
