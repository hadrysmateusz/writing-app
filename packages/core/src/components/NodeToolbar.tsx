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

  return isSelected && isFocused ? (
    <>
      {/* MAKE SURE THE SIDETOOLBARCONTAINER HAS CHILDREN TO PREVENT SELECTION ERRORS */}
      <SideToolbarContainer
        onMouseDown={handleMouseDown}
        contentEditable={false}
      >
        <FaEllipsisV />
      </SideToolbarContainer>
      {isMenuOpen && (
        <ContextMenu>
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
  user-select: none;
`
