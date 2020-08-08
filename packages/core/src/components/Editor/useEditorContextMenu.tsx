import React, { useState, useCallback } from "react"
import { useEditor, ReactEditor } from "slate-react"
import { Node } from "slate"
import styled from "styled-components/macro"

import {
  ContextMenuItem,
  useContextMenu,
  ContextMenuSeparator,
  ContextSubmenu,
} from "../ContextMenu"
import FormatButton from "../FormatButton"
import { TurnIntoContextMenuContent } from "../NodeToolbar"
import { useImageModal } from "../ImageModal"
import { useLinkModal } from "../LinkPrompt"

import { MARKS } from "../../constants/Slate"
import { CODE_INLINE, LINK, insertHorizontalRule } from "../../slate-plugins"

type ContextMenuType = {
  base: string
  node?: Element
}

const InlineFormattingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* Accounts for padding of icons */
  padding: 0 14px;
  color: #a1a1a1;
  min-width: 100%;
`

// TODO: on any context menu that is fully inside a link node, show an option to edit and remove the link
const useEditorContextMenu = () => {
  const editor = useEditor()
  const [
    contextMenuType,
    setContextMenuType,
  ] = useState<ContextMenuType | null>(null)
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { open: openImageModal } = useImageModal()
  const { open: openLinkModal } = useLinkModal()

  // TODO: extract and improve the insert logic (it's duplicated in Toolbar)
  const handleInsertHorizontalRule = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      insertHorizontalRule(editor)
    },
    [editor]
  )

  const handleToggleLink = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      openLinkModal()
    },
    [openLinkModal]
  )

  const handleInsertImage = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      openImageModal()
    },
    [openImageModal]
  )

  const renderContextMenu = useCallback(() => {
    if (contextMenuType === null) {
      throw new Error(
        "This context menu can't be opened without a proper type."
      )
    }

    const renderItems = () => {
      const { base, node } = contextMenuType

      if (base === "expanded") {
        return (
          <>
            <InlineFormattingContainer>
              <FormatButton format={MARKS.BOLD} />
              <FormatButton format={MARKS.ITALIC} />
              <FormatButton format={MARKS.STRIKE} />
              <FormatButton format={CODE_INLINE} />
              {/* TODO: This doesn't work for turning the link off */}
              <FormatButton format={LINK} onMouseDown={handleToggleLink} />
            </InlineFormattingContainer>
            <ContextMenuSeparator />
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement common actions")
              }}
            >
              Cut
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement common actions")
              }}
            >
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement common actions")
              }}
            >
              Paste
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onMouseDown={() => {
                // TODO: implement
                console.warn("TODO: implement common actions")
              }}
            >
              Select Block
            </ContextMenuItem>
          </>
        )
      }

      if (base === "collapsed") {
        return (
          <>
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement common actions")
              }}
            >
              Paste
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onMouseDown={() => {
                // TODO: implement
                console.warn("TODO: implement common actions")
              }}
            >
              Select Block
            </ContextMenuItem>
          </>
        )
      }

      if (base === "node") {
        let slateNode: Node

        console.log(node)

        try {
          slateNode = ReactEditor.toSlateNode(editor, node!)
        } catch (error) {
          // TODO: when the error boundary for this error is created this might not be necessary (or maybe some custom logic for recovering could be used)
          console.log("couldn't resolve slate node")
          return
        }

        const nodeType = slateNode.type as string | undefined

        if (nodeType === undefined) {
          throw new Error("node type can't be undefined (invalid node)")
        }

        return (
          <>
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
              <TurnIntoContextMenuContent editor={editor} node={node} />
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

            {/* <ContextMenuItem disabled>{nodeType}</ContextMenuItem> */}

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
          </>
        )
      }

      throw new Error(`invalid context menu type: ${base}`)
    }

    return <ContextMenu>{renderItems()}</ContextMenu>
  }, [
    contextMenuType,
    editor,
    handleInsertHorizontalRule,
    handleInsertImage,
    handleToggleLink,
  ])

  const openMenuWithType = (
    event: React.MouseEvent<Element, globalThis.MouseEvent>,
    type: ContextMenuType
  ) => {
    setContextMenuType(type)
    openMenu(event)
  }

  return {
    openMenu: openMenuWithType,
    renderContextMenu,
    closeMenu,
    isMenuOpen,
  }
}

export default useEditorContextMenu
