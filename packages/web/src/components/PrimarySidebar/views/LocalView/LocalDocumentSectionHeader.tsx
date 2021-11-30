import { useCallback } from "react"

import SectionHeaderComponent from "../../../DocumentsList/SectionHeaderComponent"
import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../NewContextMenu"

export const LocalDocumentSectionHeader: React.FC<{
  path: string
  isOpen: boolean
  onToggle: () => void
  removeDir: (path: string) => void
}> = ({ path, children, removeDir, isOpen, onToggle }) => {
  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleRemoveDir = useCallback(
    (_e) => {
      removeDir(path)
    },
    [path, removeDir]
  )

  return (
    <>
      <SectionHeaderComponent
        titleTooltip={path}
        isOpen={isOpen}
        onToggle={onToggle}
        onContextMenu={openMenu}
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
