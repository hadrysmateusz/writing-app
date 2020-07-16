import React, {
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react"
import styled from "styled-components/macro"
import { useEditor, ReactEditor } from "slate-react"
import { Transforms, Path, Editor, Node } from "slate"
import isHotkey from "is-hotkey"
import { cloneDeep } from "lodash"

import { plugins } from "../../pluginsList"
// import { Toolbar } from "../Toolbar"
import HoveringToolbar from "../HoveringToolbar"
import { NamingInput } from "../RenamingInput"
import { DocumentDoc } from "../Database"
import { useMainState } from "../MainState/MainStateProvider"
import { Editable, OnKeyDown } from "../../slate-plugin-system"

import {
  EditableContainer,
  OuterContainer,
  OutermostContainer,
  InsertBlockField,
  InnerContainer,
} from "./styledComponents"
import { useDocumentsAPI } from "../DocumentsAPI"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"

/**
 * Helper for creating a basic empty node
 *
 * The deep cloning prevents issues with react keys
 */
const createEmptyNode = () => {
  return cloneDeep({
    type: "paragraph",
    children: [{ text: "" }],
  })
}

const EditorComponent: React.FC<{
  // we get the currentDocument from a prop because inside this component it can't be null
  currentDocument: DocumentDoc
}> = ({ currentDocument }) => {
  const { saveDocument } = useMainState()
  const { renameDocument } = useDocumentsAPI()
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
  const insertEmptyBlock = () => {
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
            onMouseDown={(e) => {
              // If the right-mouse-button is clicked, prevent the selection from being changed
              if (e.button === 2) {
                // TODO: this bounding rect logic etc. probably needs some more work to handle different edge cases like scrolling, scrollbars etc.
                // TODO: check if the selection is already in the clicked node, if so, trigger a different context menu containing (at the moment) only the paste option, if not then trigger a third context menu for the entire node, containing actions like delete duplicate, turn into (change type), comment and maybe some static info and maybe node specific actions like change url for image etc.

                const domSelection = document.getSelection()

                let domRange

                try {
                  domRange = domSelection?.getRangeAt(0)
                } catch (error) {
                  // TODO: investigate this error further
                  return
                }

                if (domRange === undefined) return

                const rect = domRange.getBoundingClientRect()

                if (
                  e.pageX >= rect.x &&
                  e.pageX <= rect.x + rect.width &&
                  e.pageY >= rect.y &&
                  e.pageY <= rect.y + rect.height
                ) {
                  e.preventDefault()
                  openMenu(e)
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
            {/* TODO: double-clicking this area moves the selection to the start of the document */}
            <InsertBlockField onClick={() => insertEmptyBlock()} />

            {isMenuOpen && (
              <ContextMenu>
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
              </ContextMenu>
            )}
          </EditableContainer>
        </InnerContainer>
      </OuterContainer>
    </OutermostContainer>
  )
}

const TrashBanner: React.FC<{ documentId: string }> = ({ documentId }) => {
  const { restoreDocument, permanentlyRemoveDocument } = useDocumentsAPI()

  const handleRestoreDocument = useCallback(() => {
    restoreDocument(documentId)
  }, [documentId, restoreDocument])

  const handlePermanentlyRemoveDocument = useCallback(() => {
    permanentlyRemoveDocument(documentId)
  }, [documentId, permanentlyRemoveDocument])

  return (
    <TrashBannerContainer>
      <div>This document is in Trash</div>
      <button onClick={handleRestoreDocument}>Restore</button>
      <button onClick={handlePermanentlyRemoveDocument}>
        Delete permanently
      </button>
    </TrashBannerContainer>
  )
}

export const TrashBannerContainer = styled.div`
  background-color: #db4141;
  height: 44px;
  width: 100%;
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  button {
    cursor: pointer;
    display: block;
    border: 1px solid white;
    background: transparent;
    border-radius: 2px;
    padding: 4px 14px;
    font-family: "Poppins";
    font-size: 12px;
    font-weight: 500;
    color: white;

    transition: background-color 200ms ease;

    :hover {
      background-color: #e34d4d;
    }

    :active {
      background-color: #d13b3b;
    }

    /* TODO: figure out focus / outline styles */
  }
  > * + * {
    margin-left: 12px;
  }
`

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
