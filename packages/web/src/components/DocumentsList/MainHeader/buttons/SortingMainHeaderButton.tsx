import { useCallback } from "react"

import { useContextMenu } from "../../../ContextMenu/Old"

import { MainHeaderButton } from "./MainHeaderButton"

export const MoreMainHeaderButton: React.FC<{
  contextMenuContent: React.ReactNode
}> = ({ contextMenuContent }) => {
  const { isMenuOpen, openMenu, ContextMenu } = useContextMenu()

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

      {isMenuOpen ? <ContextMenu>{contextMenuContent}</ContextMenu> : null}
    </>
  )
}
