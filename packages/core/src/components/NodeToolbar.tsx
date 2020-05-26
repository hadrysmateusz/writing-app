import { Transforms, Node } from "slate"
import React, { useRef } from "react"
import { useEditor, ReactEditor, useFocused, useSelected } from "slate-react"
import styled from "styled-components/macro"

import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./ContextMenu"
import { BLOCKQUOTE } from "../slate-plugins/elements/blockquote/types"
import { CODE_BLOCK } from "../slate-plugins/elements/code-block"
import { PARAGRAPH } from "../slate-plugins/elements/paragraph"
import { HeadingType } from "../slate-plugins"

// The toolbar requires the parent element to have position: relative

// TODO: this is incompatible with list items having other nodes inside (which is extremely problematic in many situations and should probably go)

export const Toolbar: React.FC<{ nodeRef: any }> = ({ nodeRef }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const node = useRef<Node | null>(null)
  const editor = useEditor()
  const isFocused = useFocused()
  const isSelected = useSelected()

  const handleMouseDown = (event) => {
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
  return isSelected && isFocused ? (
    <>
      <SideToolbarContainer
        onMouseDown={handleMouseDown}
        onSelect={(e) => console.log(e)}
        contentEditable={false}
      />
      {isMenuOpen && (
        <ContextMenu>
          {/* TODO: replace with heading submenu  */}
          <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H1)}>
            Heading 1
          </ContextMenuItem>
          <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H2)}>
            Heading 2
          </ContextMenuItem>

          <ContextMenuItem onMouseDown={handleSetFormat(PARAGRAPH)}>
            Paragraph
          </ContextMenuItem>

          <ContextMenuSeparator />

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

const SideToolbarContainer = styled.div`
  position: absolute;
  top: 5px;
  left: -35px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  background: #41474d;
  user-select: none;
`
