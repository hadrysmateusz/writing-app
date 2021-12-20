import { useCallback } from "react"

import { ContextMenu, useContextMenu } from "../../../ContextMenu"

import { MainHeaderButton } from "./MainHeaderButton"

export const MoreMainHeaderButton: React.FC<{
  contextMenuContent: React.ReactNode
}> = ({ contextMenuContent }) => {
  const { getContextMenuProps, openMenu, isMenuOpen } = useContextMenu()

  const handleOnSortingButtonClick = useCallback(
    (e) => {
      openMenu(e)
    },
    [openMenu]
  )

  return (
    <>
      <MainHeaderButton
        tooltip="Change sorting method"
        icon="ellipsisHorizontal"
        action={handleOnSortingButtonClick}
      />

      {isMenuOpen ? (
        <ContextMenu {...getContextMenuProps()}>
          {contextMenuContent}
        </ContextMenu>
      ) : null}
    </>
  )
}
