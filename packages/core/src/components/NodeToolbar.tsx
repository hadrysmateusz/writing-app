import { Transforms, Node } from "slate"
import React, { useState, useRef, useEffect } from "react"
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
  const selectionTimeoutRef = useRef<number | null>(null)
  const node = useRef<Node | null>(null)
  const editor = useEditor()
  const [isSelecting, setIsSelecting] = useState(false)
  const isFocused = useFocused()
  const isSelected = useSelected()

  useEffect(() => {
    /* 
      when the selection goes through the toolbar element slate throws an error, I need to figure out a way to stop it
      this is an imperfect attempt at fixing it
    */
    const selectStartListener = (e) => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current)
      }
      setIsSelecting(true)
      /* 
        TODO: this solution is not perfect

        Even with the timeout you can sometimes accidentally set a selection inside the toolbar element,
        especially if you just leave your cursor where it will reappear

        An error boundary for the "Cannot resolve a Slate point from DOM point" error might help with this 
        and many other issues but it will probably not be perfect (although when it's implemented 
        this disappearing logic should probably be removed)
      */
      const timeoutId = setTimeout(() => {
        setIsSelecting(false)
      }, 400)

      selectionTimeoutRef.current = timeoutId
    }

    document.addEventListener("selectionchange", selectStartListener)
    return () => {
      document.removeEventListener("selectionchange", selectStartListener)
    }
  })

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

  return !isSelecting && isSelected && isFocused ? (
    <>
      <SideToolbarContainer
        onMouseDown={handleMouseDown}
        onSelect={(e) => console.log(e)}
      ></SideToolbarContainer>
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
