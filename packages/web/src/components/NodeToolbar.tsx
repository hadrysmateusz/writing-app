import { Transforms, Node } from "slate"
import React from "react"
import {
  useSlateStatic,
  ReactEditor,
  useFocused,
  useSelected,
} from "slate-react"
import styled from "styled-components/macro"
import { FaEllipsisV } from "react-icons/fa"

import {
  PARAGRAPH,
  BLOCKQUOTE,
  CODE_BLOCK,
  HeadingType,
  insertHorizontalRule,
  insertImage,
} from "../slate-plugins"

import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextSubmenu,
} from "./ContextMenu"
import { useListItemContext } from "../slate-plugins/elements/list/ListItemContext"

// The toolbar requires the parent element to have position: relative

// TODO: this is incompatible with list items having other nodes inside (which is extremely problematic in many situations and should probably go)

export const Toolbar: React.FC<{ nodeRef: any; slateNode: Node }> = ({
  nodeRef,
  slateNode,
}) => {
  const { openMenu, ContextMenu } = useContextMenu()
  const editor = useSlateStatic()
  const isFocused = useFocused()
  const isSelected = useSelected()
  const { listItemDirectNode } = useListItemContext()

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    openMenu(event)
  }

  // TODO: extract and improve the insert logic (it's duplicated in Toolbar)

  const handleInsertHorizontalRule = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    insertHorizontalRule(editor)
  }

  const handleInsertImage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    // TODO: replace the prompt in electron
    const url = window.prompt("Enter the URL of the image:")
    if (!url) return
    insertImage(editor, url)
  }

  return isSelected && isFocused ? (
    <>
      {/* MAKE SURE THE SIDETOOLBARCONTAINER HAS CHILDREN TO PREVENT SELECTION ERRORS */}
      <SideToolbarContainer
        onMouseDown={handleMouseDown}
        contentEditable={false}
        listItemIndent={listItemDirectNode === slateNode}
      >
        <FaEllipsisV />
      </SideToolbarContainer>

      <ContextMenu>
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
          <TurnIntoContextMenuContent editor={editor} nodeRef={nodeRef} />
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

        <ContextSubmenu text="Insert">
          <ContextMenuItem onMouseDown={handleInsertHorizontalRule}>
            Horizontal Rule
            {/* TODO: research and change the name if needed */}
          </ContextMenuItem>
          <ContextMenuItem onMouseDown={handleInsertImage}>
            Image
            {/* TODO: research and change the name if needed */}
          </ContextMenuItem>
        </ContextSubmenu>
      </ContextMenu>
    </>
  ) : null
}

export const TurnIntoContextMenuContent: React.FC<{
  /**
   * Ref to the DOM node of the slate node
   */
  nodeRef?: React.MutableRefObject<Element>
  /**
   * DOM node of the slate node
   */
  node?: Element
  editor: ReactEditor
}> = ({ nodeRef, node, editor }) => {
  const handleSetFormat = (format: string) => () => {
    if (nodeRef === undefined && node === undefined) {
      throw new Error("A node or nodeRef is required")
    }

    if (!node && nodeRef) {
      node = nodeRef.current
    }

    if (!node) {
      throw new Error("Couldn't find a correct DOM node")
    }

    let slateNode: Node

    try {
      slateNode = ReactEditor.toSlateNode(editor, node)
    } catch (error) {
      // TODO: when the error boundary for this error is created this might not be necessary (or maybe some custom logic for recovering could be used)
      console.log("couldn't resolve slate node")
      return
    }

    const path = ReactEditor.findPath(editor, slateNode)
    Transforms.setNodes(editor, { type: format }, { at: path })
    // closeMenu()
  }

  return (
    <>
      <ContextMenuItem onMouseDown={handleSetFormat(PARAGRAPH)}>
        Paragraph
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H1)}>
        Heading 1
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H2)}>
        Heading 2
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H3)}>
        Heading 3
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onMouseDown={handleSetFormat(BLOCKQUOTE)}>
        Blockquote
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(CODE_BLOCK)}>
        Code Block
      </ContextMenuItem>

      <ContextMenuSeparator />

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

      {/* <ContextMenuItem onMouseDown={handleSetFormat(PARAGRAPH)}>
        Paragraph
      </ContextMenuItem>
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

      <ContextMenuSeparator />

      <ContextMenuItem onMouseDown={handleSetFormat(BLOCKQUOTE)}>
        Blockquote
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(CODE_BLOCK)}>
        Code Block
      </ContextMenuItem>

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
      </ContextSubmenu> */}
    </>
  )
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

const SideToolbarContainer = styled.div<{ listItemIndent: boolean }>`
  position: absolute;
  top: 3px;
  font-size: 17px;
  color: #41474d;
  left: ${(p) => (p.listItemIndent ? -49 : -25)}px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  user-select: none;
`
