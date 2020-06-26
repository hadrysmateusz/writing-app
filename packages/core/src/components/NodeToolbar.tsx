import { Transforms, Node } from "slate"
import React, { useRef } from "react"
import { useEditor, ReactEditor, useFocused, useSelected } from "slate-react"
import styled from "styled-components/macro"
import { FaEllipsisV } from "react-icons/fa"

import { BLOCKQUOTE } from "../slate-plugins/elements/blockquote/types"
import { CODE_BLOCK } from "../slate-plugins/elements/code-block"
import { PARAGRAPH } from "../slate-plugins/elements/paragraph"
import { HeadingType } from "../slate-plugins"

import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextSubmenu,
} from "./ContextMenu"

// The toolbar requires the parent element to have position: relative
// The toolbar needs to not be put after the contentEditable contents of a slate node because it will result in the caret moving into it if the users clicks downarrow in the last block in the document (there might be other related issues with this) TODO: there are more issues - if you press "delete" at the end of an empty node while there is another node beneath the cursor will be moved inside the toolbar

// TODO: this is incompatible with list items having other nodes inside (which is extremely problematic in many situations and should probably go)

export const Toolbar: React.FC<{ nodeRef: any }> = ({ nodeRef }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const node = useRef<Node | null>(null)
  const editor = useEditor()
  const isFocused = useFocused()
  const isSelected = useSelected()

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!nodeRef?.current) {
      console.log("invalid ref")
      return
    }

    try {
      const slateNode = ReactEditor.toSlateNode(editor, nodeRef.current)
      node.current = slateNode
    } catch (error) {
      // TODO: when the error boundary for this error is created this might not be necessary (or maybe some custom logic for recovering could be used)
      console.log("couldn't resolve slate node")
    }

    openMenu(event)
  }

  const handleSetFormat = (format: string) => () => {
    if (!node.current) {
      console.log("no node selected")
      return
    }
    const path = ReactEditor.findPath(editor, node.current)
    Transforms.setNodes(editor, { type: format }, { at: path })
    closeMenu()
  }

  /*
    TODO: a possible solution to the selection error could be using a portal - but it would
    require positioning the toolbar with js in a way that would react to every change in position 
    of the node in real-time
  */

  /*
    TODO: a solution to the dom selection / toolbar issue might be to create a "selectionchange" listener that will check if the anchor or focus of the dom selection is inside a node that's not a text node and attempt to move it into the closest text child (that's also inside a node with the correct data- attributes created by slate (to make sure it doesn't end up somewhere inside the toolbar))

    Or a more comprehansive solution could be proposed upstream to how contenteditable is set on nodes inside editable - it seems to default to inherit which makes every dom node editable while only the text content inside the most low-level dom node of a slate node should be editable (or for super custom node types, contentEditable=true could be set manually in the node component)
  */
  return isSelected && isFocused ? (
    <>
      {/* MAKE SURE THE SIDETOOLBARCONTAINER HAS CHILDREN TO PREVENT SELECTION ERRORS */}
      <SideToolbarContainer
        onMouseDown={handleMouseDown}
        contentEditable={false}
      >
        {/* <Icon icon="ellipsisVertical" /> */}
        <FaEllipsisV />
      </SideToolbarContainer>
      {isMenuOpen && (
        <ContextMenu>
          {/* TODO: replace with heading submenu  */}

          <ContextSubmenu text="Heading">
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H1)}>
              Heading 1
            </ContextMenuItem>
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H2)}>
              Heading 2
            </ContextMenuItem>
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H3)}>
              Heading 3
            </ContextMenuItem>
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H4)}>
              Heading 4
            </ContextMenuItem>
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H5)}>
              Heading 5
            </ContextMenuItem>
            <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H6)}>
              Heading 6
            </ContextMenuItem>
          </ContextSubmenu>

          <ContextSubmenu text="List">
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO")
              }}
            >
              Bulleted List
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO")
              }}
            >
              Numbered List
            </ContextMenuItem>
          </ContextSubmenu>

          <ContextMenuSeparator />

          <ContextMenuItem onMouseDown={handleSetFormat(PARAGRAPH)}>
            Paragraph
          </ContextMenuItem>

          <ContextMenuItem onMouseDown={handleSetFormat(BLOCKQUOTE)}>
            Blockquote
          </ContextMenuItem>
          <ContextMenuItem onMouseDown={handleSetFormat(CODE_BLOCK)}>
            Code Block
          </ContextMenuItem>
        </ContextMenu>
      )}
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

const SideToolbarContainer = styled.div`
  position: absolute;
  top: 3px;
  font-size: 17px;
  color: #41474d;
  left: -25px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  /* background: #41474d; */
  user-select: none;
`
