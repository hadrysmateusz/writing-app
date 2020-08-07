import React, { useState, useCallback } from "react"
import { useEditor, ReactEditor } from "slate-react"
import { Node } from "slate"

import {
  ContextMenuItem,
  useContextMenu,
  ContextMenuSeparator,
  ContextSubmenu,
} from "../ContextMenu"
import FormatButton from "../FormatButton"

import { MARKS } from "../../constants/Slate"
import {
  CODE_INLINE,
  LINK,
  insertLink,
  insertHorizontalRule,
  insertImage,
} from "../../slate-plugins"
import { TurnIntoContextMenuContent } from "../NodeToolbar"

type ContextMenuType = {
  base: string
  node?: Element
}

const useEditorContextMenu = () => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const [
    contextMenuType,
    setContextMenuType,
  ] = useState<ContextMenuType | null>(null)
  const editor = useEditor()

  const renderContextMenu = useCallback(() => {
    if (contextMenuType === null) {
      throw new Error(
        "This context menu can't be opened without a proper type."
      )
    }

    // TODO: extract this logic to a helper
    const onToggleLink = (event: React.MouseEvent) => {
      event.preventDefault()

      const url = window.prompt("Enter the URL of the link:") // TODO: replace the prompt
      if (!url) return
      insertLink(editor, url)
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

    const renderItems = () => {
      const { base, node } = contextMenuType

      if (base === "expanded") {
        return (
          <>
            <div style={{ display: "flex" }}>
              <FormatButton format={MARKS.BOLD} />
              <FormatButton format={MARKS.ITALIC} />
              <FormatButton format={MARKS.STRIKE} />
              <FormatButton format={CODE_INLINE} />
              <FormatButton format={LINK} onMouseDown={onToggleLink} />
            </div>
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
          </>
        )
      }

      if (base === "collapsed") {
        return (
          <ContextMenuItem
            onMouseDown={() => {
              console.warn("TODO: implement common actions")
            }}
          >
            Paste
          </ContextMenuItem>
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
  }, [contextMenuType, editor])

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
