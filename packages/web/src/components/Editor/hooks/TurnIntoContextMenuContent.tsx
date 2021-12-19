import { ELEMENT_H1, ELEMENT_H2 } from "@udecode/plate"
import { Transforms, Node, Editor } from "slate"
import { ReactEditor } from "slate-react"

import { ContextMenuItem } from "../../ContextMenu/New"
import { ContextMenuSeparator } from "../../ContextMenu/Common"

export const TurnIntoContextMenuContent: React.FC<{
  /**
   * Ref to the DOM node of the slate node
   */
  nodeRef?: React.MutableRefObject<Element>
  /**
   * DOM node of the slate node
   */
  node?: Element
  editor: Editor
  slateNode: Node
}> = ({ nodeRef, node, editor, slateNode }) => {
  // const handleSetFormat = (format: string) => () => {
  //   if (nodeRef === undefined && node === undefined) {
  //     throw new Error("A node or nodeRef is required")
  //   }

  //   if (!node && nodeRef) {
  //     node = nodeRef.current
  //   }

  //   if (!node) {
  //     throw new Error("Couldn't find a correct DOM node")
  //   }

  //   let slateNode: Node

  //   try {
  //     slateNode = ReactEditor.toSlateNode(editor, node)
  //   } catch (error) {
  //     // TODO: when the error boundary for this error is created this might not be necessary (or maybe some custom logic for recovering could be used)
  //     console.log("couldn't resolve slate node")
  //     return
  //   }

  //   const path = ReactEditor.findPath(editor, slateNode)
  //   Transforms.setNodes(editor, { type: format }, { at: path })
  //   // closeMenu()
  // }
  return (
    <>
      {/* <ContextMenuItem onMouseDown={handleSetFormat(PARAGRAPH)}>
        Paragraph
      </ContextMenuItem> */}

      <ContextMenuSeparator />

      {/* active: !!(editor !== null && editor !== void 0 && editor.selection) && plateCommon.isMarkActive(editor, type),
    onMouseDown: editor ? plateCommon.getPreventDefaultHandler(plateCommon.toggleMark, editor, type, clear) : undefined, */}

      <ContextMenuItem
        text="Heading 1"
        onMouseDown={
          editor
            ? (e) => {
                console.log("Heading 1", editor)
                console.log("slateNode", slateNode)

                // TODO: check if node is already of this type and other improvements for reliability, especially for nested nodes (make sure it works with lists and code blocks)

                const nodePath = ReactEditor.findPath(editor, slateNode)

                Transforms.setNodes(
                  editor,
                  {
                    type: ELEMENT_H1,
                  },
                  { at: nodePath }
                )
              }
            : undefined
        }
      />
      <ContextMenuItem
        text="Heading 2"
        onMouseDown={
          editor
            ? (e) => {
                console.log("Heading 2", editor)
                console.log("slateNode", slateNode)

                // TODO: check if node is already of this type and other improvements for reliability, especially for nested nodes (make sure it works with lists and code blocks)

                const nodePath = ReactEditor.findPath(editor, slateNode)

                Transforms.setNodes(
                  editor,
                  {
                    type: ELEMENT_H2,
                  },
                  { at: nodePath }
                )
              }
            : undefined
        }
      />
      {/* <ContextMenuItem
        text="Heading 3"
        onMouseDown={
          editor
            ? (e) => {
                console.log("Heading 3", editor)
                console.log("slateNode", slateNode)

                // TODO: check if node is already of this type and other improvements for reliability, especially for nested nodes (make sure it works with lists and code blocks)

                const nodePath = ReactEditor.findPath(editor, slateNode)

                Transforms.setNodes(
                  editor,
                  {
                    type: ELEMENT_H3,
                  },
                  { at: nodePath }
                )
              }
            : undefined
        }
      /> */}

      {/* <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H2)}>
        Heading 2
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(HeadingType.H3)}>
        Heading 3
      </ContextMenuItem> */}

      <ContextMenuSeparator />

      {/* <ContextMenuItem onMouseDown={handleSetFormat(BLOCKQUOTE)}>
        Blockquote
      </ContextMenuItem>
      <ContextMenuItem onMouseDown={handleSetFormat(CODE_BLOCK)}>
        Code Block
      </ContextMenuItem> */}

      <ContextMenuSeparator />

      <ContextMenuItem
        disabled
        onMouseDown={() => {
          console.warn("TODO")
        }}
      >
        Bulleted List
      </ContextMenuItem>
      <ContextMenuItem
        disabled
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
