import React, {
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
  MouseEvent,
} from "react"
import styled from "styled-components/macro"
import { useEditor, ReactEditor } from "slate-react"
import { Transforms, Path, Editor, Node } from "slate"
import isHotkey from "is-hotkey"

import HoveringToolbar from "../HoveringToolbar"
import { NamingInput } from "../RenamingInput"
import { DocumentDoc } from "../Database"
import { useMainState } from "../MainState/MainStateProvider"
import {
  EditableContainer,
  OuterContainer,
  OutermostContainer,
  InsertBlockField,
  InnerContainer,
} from "./styledComponents"
import { useDocumentsAPI } from "../DocumentsAPI"
import TrashBanner from "../TrashBanner"
import {
  ContextMenuItem,
  useContextMenu,
  ContextMenuSeparator,
} from "../ContextMenu"
import FormatButton from "../FormatButton"

import { plugins } from "../../pluginsList"
import { Editable, OnKeyDown } from "../../slate-plugin-system"
import { createEmptyNode } from "../../helpers/createEmptyNode"
import { MARKS } from "../../constants/Slate"
import { CODE_INLINE, LINK, insertLink } from "../../slate-plugins"

const EditorComponent: React.FC<{
  // we get the currentDocument from a prop because inside this component it can't be null
  currentDocument: DocumentDoc
}> = ({ currentDocument }) => {
  const { saveDocument } = useMainState()
  const { renameDocument } = useDocumentsAPI()
  const [contextMenuType, setContextMenuType] = useState<{
    base: string
    node?: Node
  } | null>(null)
  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const editor = useEditor()
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()

  // TODO: check if this is still needed
  const fixSelection = () => {
    // This workaround aims to fix the issue with the cursor being visually stuck inside the node toolbar or other custom elements inside the editable area.
    // Fun fact: the caret seems to actually be inside the editable parent component and not the toolbar as it would seem
    // TODO: It is a quick and dirty solution and might not work sometimes and be triggered when it shouldn't - this should be addressed
    // TODO: find the root cause of this issue, it might be related to some internal slate bug that could be fixed upstream
    // TODO: there is still an issue where the selection is messed up after clicking at the InsertNodeBlock
    setTimeout(() => {
      if (!ReactEditor.isFocused) return
      const selection = document.getSelection()
      // if there is no slate selection there is nothing to restore it from
      if (!editor.selection) {
        selection?.empty()
        return
      }
      // this checks if both anchor and focus nodes of the DOM selection are in a node that is not a TEXT_NODE (which suggests that the selection is invalid)
      if (selection && selection.focusNode && selection.anchorNode) {
        // restore the DOM selection from slate selection
        const slateNode = Node.get(editor, editor.selection.anchor.path)
        const domNode = ReactEditor.toDOMNode(editor, slateNode)
        const editorEl = ReactEditor.toDOMNode(editor, editor)
        if (
          domNode.closest(`[data-slate-editor]`) === editorEl &&
          domNode.closest(`[data-slate-node]`) === editorEl
        ) {
          selection.setPosition(domNode)
        }
      }
    }, 0)
  }

  const handleFixSelection = (event: React.KeyboardEvent) => {
    if (isHotkey(["Del"], event)) {
      fixSelection()
    }
  }

  // When the document title changes elsewhere, update the state here
  useEffect(() => {
    setTitle(currentDocument.title)
  }, [currentDocument.title, setTitle])

  /**
   * Focus the correct element on mount
   */
  useEffect(() => {
    // don't focus content because it can lead to issues if and is not very intuitive (maybe focus the end)
    if (title === "") {
      titleRef.current?.focus()
    }
    // eslint-disable-next-line
  }, [])

  // TODO: try using this event in the entire editor area as it would be more intuitive I think
  // TODO: also apply renaming (if focus is in the title input)
  const handleSaveDocument: OnKeyDown = async (event: KeyboardEvent) => {
    if (isHotkey("mod+s", event)) {
      event.preventDefault()
      await saveDocument()
    }
  }

  const handleContentBlur = async () => {
    // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
    await saveDocument()
  }

  /*
    TODO: this solution might be a bit too basic and might need to be replaced with normalization
    It should also take into account the depth of the path and the type of the node (e.g. list items)
    TODO: this should probably be merged with a solution for selecting the correct block by clicking 
    next to it - my best guess is, it would be an event listener on the entire editor area that would 
    get the position of the click and compare it to the bounding boxes of blocks until it finds the 
    correct one (this would be a good place to use a more efficient search algorithm as it's not 
    insignificantly expensive to compare the positions of many nodes)
  */
  const handleInsertEmptyBlock = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const newPath = [editor.children.length]
    const lastPath = Path.previous(newPath)
    const [lastNode] = Editor.node(editor, lastPath, { edge: "end" })
    // TODO: this assumes that the node is a leaf (which should always be true because of the way we get it but might cause issues in the future and should probably have some fallbacks)
    if (lastNode.text === "") {
      Transforms.select(editor, lastPath)
    } else {
      Transforms.insertNodes(editor, createEmptyNode(), {
        at: newPath,
        select: true,
      })
    }
    ReactEditor.focus(editor)
  }

  const handleRename = (newValue: string) => {
    renameDocument(currentDocument.id, newValue)
  }

  const handleTitleKeydown = (event: React.KeyboardEvent) => {
    // TODO: allow other ways of navigating between the title and editor content like arrow down and up (there are many multi-line considerations there)
    // TODO: why is the Esc here?
    if (isHotkey(["Enter", "Esc"], event)) {
      // prevent the line break from being inserted into the title (TODO: some version of this behavior might be desirable)
      event.preventDefault()
      // TODO: insert an empty block at the start of the editor
      Transforms.insertNodes(editor, createEmptyNode(), {
        at: [0],
        select: true,
      })
      // move focus to the editor (as if the title was a part of the editable area) - this will automatically trigger a rename
      ReactEditor.focus(editor)
      return false
    }
    return true
  }

  const handleTitleChange = (newValue: string) => {
    setTitle(newValue)
  }

  const onToggleLink = (event: React.MouseEvent) => {
    event.preventDefault()

    const url = window.prompt("Enter the URL of the link:")
    if (!url) return
    insertLink(editor, url)
  }

  const renderContextMenu = () => {
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
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement")
              }}
            >
              Turn into
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onMouseDown={() => {
                console.warn("TODO: implement")
              }}
            >
              Comment
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>{node?.type}</ContextMenuItem>
          </>
        )
      }

      throw new Error(`invalid context menu type: ${base}`)
    }

    return <ContextMenu>{renderItems()}</ContextMenu>
  }

  return (
    <OutermostContainer>
      {currentDocument.isDeleted && (
        <TrashBanner documentId={currentDocument.id}>
          This document is in Trash
        </TrashBanner>
      )}
      <OuterContainer>
        <InnerContainer>
          <HoveringToolbar />
          {/* <Toolbar /> */}
          <StyledNamingInput
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeydown}
            onRename={handleRename}
          />
          <EditableContainer
            onBlur={handleContentBlur}
            onMouseDown={(
              event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
            ) => {
              // If the right-mouse-button is clicked, prevent the selection from being changed and trigger the correct context menu
              if (event.button === 2) {
                const domSelection = document.getSelection()

                // these refer to the dom nodes that directly map to slate element nodes
                let selectionTargetParentSlateNode: Element | null = null
                let eventTargetParentSlateNode: Element | null = null

                if (domSelection !== null) {
                  // if the selection is expanded and the event is within the selection, trigger the appropriate menu
                  if (!domSelection.isCollapsed) {
                    let domRange: Range

                    try {
                      domRange = domSelection.getRangeAt(0)
                    } catch (error) {
                      console.log("no range")
                      // TODO: investigate this error further
                      return
                    }

                    const rect = domRange.getBoundingClientRect()

                    // If the click was inside the bounding rect of the selection then trigger the selection-specific context menu
                    // TODO: this bounding rect logic etc. probably needs some more work to handle different edge cases like scrolling, scrollbars etc.
                    if (
                      event.pageX >= rect.x &&
                      event.pageX <= rect.x + rect.width &&
                      event.pageY >= rect.y &&
                      event.pageY <= rect.y + rect.height
                    ) {
                      event.preventDefault()
                      setContextMenuType({ base: "expanded" })
                      openMenu(event)
                    }
                    return
                  }

                  const selectionTargetParent =
                    domSelection.anchorNode?.parentElement

                  if (!selectionTargetParent) {
                    selectionTargetParentSlateNode = null
                  } else {
                    selectionTargetParentSlateNode = selectionTargetParent.closest(
                      `[data-slate-node="element"]`
                    )
                  }
                }

                let targetElement: HTMLElement

                const targetNode = event.target as globalThis.Node

                // if the node is already an element then use it if not find it's parent element
                if (targetNode.nodeType === 1) {
                  targetElement = targetNode as HTMLElement
                } else {
                  targetElement = targetNode.parentElement!
                }

                eventTargetParentSlateNode = targetElement.closest(
                  `[data-slate-node="element"]`
                )

                if (eventTargetParentSlateNode === null) return // TODO: better handle this

                if (
                  selectionTargetParentSlateNode?.isSameNode(
                    eventTargetParentSlateNode
                  )
                ) {
                  setContextMenuType({ base: "collapsed" })
                  openMenu(event)
                  return
                }

                const slateNode = ReactEditor.toSlateNode(
                  editor,
                  eventTargetParentSlateNode
                )

                // open context menu for a slate node TODO: it would probably be better to somehow notify the react component that it should handle this, it could also set some custom highlighting styles etc.
                if (typeof slateNode.type === "string") {
                  event.preventDefault()
                  setContextMenuType({ base: "node", node: slateNode })
                  openMenu(event)
                  return
                } else {
                  return // TODO: better handle this
                }
              }
            }}
          >
            <Editable
              plugins={plugins}
              placeholder="Start writing"
              onKeyDown={[handleSaveDocument, handleFixSelection]}
              spellCheck={false}
            />
            <InsertBlockField onMouseDown={handleInsertEmptyBlock} />

            {isMenuOpen && renderContextMenu()}
          </EditableContainer>
        </InnerContainer>
      </OuterContainer>
    </OutermostContainer>
  )
}

const StyledNamingInput = styled(NamingInput)`
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  font-family: "Poppins";
  letter-spacing: 0.01em;
  font-size: 36px;
  line-height: 54px;
  color: #f8f8f8;
`

export default EditorComponent
