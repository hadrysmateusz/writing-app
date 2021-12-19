import React, { useState, useCallback } from "react"
import { ReactEditor } from "slate-react"
import { Editor, Node, Transforms } from "slate"
import styled from "styled-components/macro"
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  usePlateEditorRef,
  usePlateEventId,
  MarkToolbarButton,
  ELEMENT_LINK,
  serializeHtml,
  deserializeHtml,
  getPluginType,
} from "@udecode/plate"

import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
  ContextMenu,
} from "../../ContextMenu/New"
import { ContextMenuSeparator } from "../../ContextMenu/Common"
import Icon from "../../Icon"

import { useLinkModal } from "../LinkModal"
import { useImageModal } from "../ImageModal"
import { ToolbarLink } from "../Toolbars" // TODO: refactor those components to make them more general

import { TurnIntoContextMenuContent } from "./TurnIntoContextMenuContent"

type ContextMenuType = {
  base: "collapsed" | "expanded" | "node"
  node: Element
}

// TODO: on any context menu that is fully inside a link node, show an option to edit and remove the link
export const useEditorContextMenu = () => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  const { getContextMenuProps, openMenu, closeMenu, isMenuOpen } =
    useContextMenu()
  const { insertImageFromModal } = useImageModal()
  const { getLinkUrl } = useLinkModal()

  const [contextMenuType, setContextMenuType] =
    useState<ContextMenuType | null>(null)

  // TODO: ensure this works properly in both electron and the browser by checking for permissions etc.
  const addSelectionToClipboard = useCallback(async (): Promise<void> => {
    if (editor && editor.selection) {
      const fragment = Editor.fragment(editor, editor.selection)

      const html = serializeHtml(editor, {
        nodes: fragment,
      })

      const items = {}

      const type1 = "text/html"
      const blob1: any = new Blob([html], { type: type1 }) // TODO: figure out why typescript freaks out without casting to any
      items[type1] = blob1

      const selection = window.getSelection()
      if (selection) {
        const type2 = "text/plain"
        const blob1: any = new Blob([selection.toString()], { type: type2 })
        items[type2] = blob1
      }

      const data = [new ClipboardItem(items)]

      navigator.clipboard.write(data).then(() => {
        console.log("success")
      })
    }
  }, [editor])

  const copySelectionToClipboard = useCallback(async (): Promise<void> => {
    addSelectionToClipboard()
  }, [addSelectionToClipboard])

  const cutSelectionToClipboard = useCallback(async (): Promise<void> => {
    await addSelectionToClipboard()

    if (editor !== undefined) {
      Transforms.delete(editor)
    }
  }, [addSelectionToClipboard, editor])

  // TODO: figure out how to programmatically paste formatted HTML
  const pasteFromClipboard = useCallback(async (): Promise<void> => {
    console.warn("TODO: make this work")
    const clipboardItems = await navigator.clipboard.read()

    for (const clipboardItem of clipboardItems) {
      if (clipboardItem.types.includes("text/html")) {
        const blob = await clipboardItem.getType("text/html")
        const htmlObject = document.createElement("div")
        htmlObject.innerHTML = await blob.text() // TODO: make sure this is secure and can't be exploited

        const preparedHTMLObject = { element: htmlObject, children: [] }

        console.log(preparedHTMLObject)

        if (editor) {
          const fragment = deserializeHtml(editor, preparedHTMLObject)
          console.log(fragment)
        }
      }
    }
  }, [editor])

  const handleCopySelectionToClipboard = useCallback(() => {
    copySelectionToClipboard()
  }, [copySelectionToClipboard])

  const handleCutSelectionToClipboard = useCallback(() => {
    cutSelectionToClipboard()
  }, [cutSelectionToClipboard])

  const handlePasteFromClipboard = useCallback(() => {
    pasteFromClipboard()
  }, [pasteFromClipboard])

  const handleInsertImage = useCallback(
    async (event) => {
      event.preventDefault()
      insertImageFromModal()
    },
    [insertImageFromModal]
  )

  // const handleToggleLink = async (event) => {
  //   event.preventDefault()
  //   upsertLinkFromModal()
  // }

  const handleSelectBlock = useCallback(
    (e) => {
      if (!editor) {
        console.warn("editor is undefined")
        return
      }

      Transforms.deselect(editor)

      setContextMenuType((prev) => {
        if (prev === null) {
          return null
        }
        return { ...prev, base: "node" }
      })

      e.preventDefault()
      e.stopPropagation()
    },
    [editor]
  )

  const renderContextMenu = useCallback(() => {
    if (contextMenuType === null) {
      throw new Error(
        "This context menu can't be opened without a proper type."
      )
    }

    if (editor === undefined) {
      throw new Error(
        "Context menu can't be opened because the editor is undefined"
      )
    }

    const renderItems = () => {
      const { base, node } = contextMenuType

      if (base === "expanded") {
        return (
          <>
            <InlineFormattingContainer>
              <MarkToolbarButton
                type={getPluginType(editor, MARK_BOLD)}
                icon={<Icon icon={MARK_BOLD} />}
              />
              <MarkToolbarButton
                type={getPluginType(editor, MARK_ITALIC)}
                icon={<Icon icon={MARK_ITALIC} />}
              />
              <MarkToolbarButton
                type={getPluginType(editor, MARK_STRIKETHROUGH)}
                icon={<Icon icon={MARK_STRIKETHROUGH} />}
              />
              <MarkToolbarButton
                type={getPluginType(editor, MARK_CODE)}
                icon={<Icon icon={MARK_CODE} />}
              />
              <ToolbarLink
                getLinkUrl={getLinkUrl}
                icon={<Icon icon={ELEMENT_LINK} />}
              />
            </InlineFormattingContainer>

            <ContextMenuSeparator />

            <ContextMenuItem
              text="Copy"
              onMouseDown={handleCopySelectionToClipboard}
            />
            <ContextMenuItem
              text="Cut"
              onMouseDown={handleCutSelectionToClipboard}
            />
            <ContextMenuItem
              text="Paste"
              onMouseDown={handlePasteFromClipboard}
            />

            <ContextMenuSeparator />

            <ContextMenuItem
              text="Select Block"
              onMouseDown={handleSelectBlock}
            />
          </>
        )
      }

      if (base === "collapsed") {
        return (
          <>
            <ContextMenuItem
              text="Paste"
              onMouseDown={handlePasteFromClipboard}
            />

            <ContextMenuSeparator />

            <ContextMenuItem
              text="Select Block"
              onMouseDown={handleSelectBlock}
            />
          </>
        )
      }

      if (base === "node") {
        let slateNode: Node

        try {
          slateNode = ReactEditor.toSlateNode(editor, node!)
        } catch (error) {
          // TODO: when the error boundary for this error is created this might not be necessary (or maybe some custom logic for recovering could be used)
          console.log("couldn't resolve slate node")
          return
        }

        const nodeType = "type" in slateNode ? slateNode.type : undefined

        if (nodeType === undefined) {
          throw new Error("node type can't be undefined (invalid node)")
        }

        return (
          <>
            <ContextMenuItem
              text="Delete"
              disabled
              onMouseDown={() => {
                console.warn("TODO: implement")
              }}
            />

            <ContextMenuItem
              text="Duplicate"
              disabled
              onMouseDown={() => {
                console.warn("TODO: implement")
              }}
            />

            <ContextSubmenu text="Turn into">
              <TurnIntoContextMenuContent
                editor={editor}
                node={node}
                slateNode={slateNode}
              />
            </ContextSubmenu>

            <ContextMenuSeparator />

            <ContextMenuItem
              text="Comment"
              disabled
              onMouseDown={() => {
                console.warn("TODO: implement")
              }}
            />

            <ContextMenuSeparator />

            <ContextSubmenu text="Insert">
              <ContextMenuItem text="Image" onMouseDown={handleInsertImage} />

              <ContextMenuItem
                text="Horizontal Rule"
                disabled
                /* onMouseDown={handleInsertHorizontalRule} */
              />
            </ContextSubmenu>
          </>
        )
      }

      throw new Error(`invalid context menu type: ${base}`)
    }

    return isMenuOpen ? (
      <ContextMenu {...getContextMenuProps()}>{renderItems()}</ContextMenu>
    ) : null
  }, [
    contextMenuType,
    editor,
    getContextMenuProps,
    getLinkUrl,
    handleCopySelectionToClipboard,
    handleCutSelectionToClipboard,
    handleInsertImage,
    handlePasteFromClipboard,
    handleSelectBlock,
    isMenuOpen,
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

const InlineFormattingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* Accounts for padding of icons */
  padding: 0 14px;
  color: var(--light-300);
  min-width: 100%;
`

export default useEditorContextMenu
