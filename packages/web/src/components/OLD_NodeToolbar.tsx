import { Node } from "slate"
import React from "react"
import { useSlateStatic, useFocused, useSelected } from "slate-react"

import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
  ContextMenu,
} from "./ContextMenu/New"
import { ContextMenuSeparator } from "./ContextMenu/Common"
import { TurnIntoContextMenuContent } from "./Editor/hooks/TurnIntoContextMenuContent"

// The toolbar requires the parent element to have position: relative

// TODO: this is incompatible with list items having other nodes inside (which is extremely problematic in many situations and should probably go)

export const Toolbar: React.FC<{ nodeRef: any; slateNode: Node }> = ({
  nodeRef,
  slateNode,
}) => {
  const { getContextMenuProps, isMenuOpen } = useContextMenu()
  const editor = useSlateStatic()
  const isFocused = useFocused()
  const isSelected = useSelected()
  // const { listItemDirectNode } = useListItemContext()

  // const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault()
  //   event.stopPropagation()

  //   openMenu(event)
  // }

  // TODO: extract and improve the insert logic (it's duplicated in Toolbar)

  // const handleInsertHorizontalRule = (
  //   event: React.MouseEvent<HTMLDivElement>
  // ) => {
  //   event.preventDefault()
  //   insertHorizontalRule(editor)
  // }

  // const handleInsertImage = (event: React.MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault()

  //   // TODO: replace the prompt in electron
  //   const url = window.prompt("Enter the URL of the image:")
  //   if (!url) return
  //   insertImage(editor, url)
  // }

  return isSelected && isFocused ? (
    <>
      {/* MAKE SURE THE SIDETOOLBARCONTAINER HAS CHILDREN TO PREVENT SELECTION ERRORS */}
      {/* <SideToolbarContainer
        onMouseDown={handleMouseDown}
        contentEditable={false}
        listItemIndent={listItemDirectNode === slateNode}
      >
        <FaEllipsisV />
      </SideToolbarContainer> */}

      {isMenuOpen ? (
        <ContextMenu {...getContextMenuProps()}>
          <ContextMenuItem
            onMouseDown={() => {
              console.warn("TODO: implement")
            }}
          >
            Delete
          </ContextMenuItem>

          <ContextMenuItem
            onMouseDown={() => {
              console.warn("TODO: implement")
            }}
          >
            Duplicate
          </ContextMenuItem>

          <ContextSubmenu text="Turn into">
            <TurnIntoContextMenuContent
              editor={editor}
              nodeRef={nodeRef}
              slateNode={slateNode}
            />
          </ContextSubmenu>

          <ContextMenuSeparator />

          <ContextMenuItem
            onMouseDown={() => {
              console.warn("TODO: implement")
            }}
          >
            Comment
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* <ContextSubmenu text="Insert">
          <ContextMenuItem onMouseDown={handleInsertHorizontalRule}>
            Horizontal Rule
          </ContextMenuItem>
          <ContextMenuItem onMouseDown={handleInsertImage}>
            Image
          </ContextMenuItem>
        </ContextSubmenu> */}
        </ContextMenu>
      ) : null}
    </>
  ) : null
}

// TODO: return to this component once react context is implemented for the contextmenu component
// const TransformInto_ContextMenuItem = () => {
//   useCallback(handleSetFormat(HeadingType.H1), [])

//   return (
//     <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H1)}>
//       Heading 1
//     </ContextMenuItem>
//   )
// }

// const SideToolbarContainer = styled.div<{ listItemIndent: boolean }>`
//   position: absolute;
//   top: 3px;
//   font-size: 17px;
//   color: var(--dark-500);
//   left: ${(p) => (p.listItemIndent ? -49 : -25)}px;
//   width: 20px;
//   height: 20px;
//   cursor: pointer;
//   border-radius: 50%;
//   user-select: none;
// `
