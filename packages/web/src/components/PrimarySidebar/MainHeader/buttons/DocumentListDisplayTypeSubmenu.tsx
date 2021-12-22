import { ContextMenuItem, ContextSubmenu } from "../../../ContextMenu"
import { LocalSettings } from "../../../Database"
import { usePrimarySidebar } from "../../../ViewState"

import { SortingMenuItemInnerWrapper } from "../MainHeader.styles"

/* TODO: don't show this for views like inbox or trash (this will probably have to be solved with component composition) */
export const DocumentListDisplayTypeSubmenu: React.FC = () => {
  return (
    <ContextSubmenu text="Display Type">
      <DisplayTypeMenuItem value="nested_list">Nested List</DisplayTypeMenuItem>
      <DisplayTypeMenuItem value="flat_list">Flat List</DisplayTypeMenuItem>
      {/* TODO: add a tree layout similiar to ones in navigator sidebar but with documents as well */}
      {/* TODO: when I add the 3rd display type, update the actual typing of the value */}
    </ContextSubmenu>
  )
}

const DisplayTypeMenuItem: React.FC<{
  value: LocalSettings["documentsListDisplayType"]
}> = ({ children, value }) => {
  const { switchDocumentsListDisplayType, documentsListDisplayType } =
    usePrimarySidebar()

  const isActive = documentsListDisplayType === value

  return (
    <ContextMenuItem
      onClick={() => {
        switchDocumentsListDisplayType(value)
      }}
    >
      <SortingMenuItemInnerWrapper isActive={isActive}>
        {children}
      </SortingMenuItemInnerWrapper>
    </ContextMenuItem>
  )
}
