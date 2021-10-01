import React, { useMemo } from "react"

import { ReactEditor } from "slate-react"
import isHotkey from "is-hotkey"
import {
  Plate,
  createPlateComponents,
  createPlateOptions,
  useStoreEditorRef,
  useEventEditorId,
} from "@udecode/plate"
import { EditableProps } from "slate-react/dist/components/editable"

// import HoveringToolbar from "../HoveringToolbar"
// import { useUserdata } from "../Userdata"
// import { useViewState } from "../ViewState"
import { DocumentDoc } from "../Database"
import { SaveDocumentFn, useMainState } from "../MainProvider"
import TrashBanner from "../TrashBanner"
import { useEditorState } from "../EditorStateProvider"
import Toolbar from "../Toolbar"
import { EditorTabsBar } from "../EditorTabs"
import { ImageModalProvider } from "../ImageModal"
import { LinkModalProvider } from "../LinkPrompt"

import { withDelayRender } from "../../withDelayRender"

import {
  EditableContainer,
  OuterContainer,
  OutermostContainer,
  // InsertBlockField,
  InnerContainer,
  OutermosterContainer,
} from "./styledComponents"
import useEditorContextMenu from "./useEditorContextMenu"
import pluginsList from "./pluginsList"
import { deserialize } from "./serialization"
import TitleInput from "./TitleInput"

const DocumentLoadingState = withDelayRender(1000)(() => <div>Loading</div>)

const components = createPlateComponents()
const options = createPlateOptions()

/**
 * Renders the editor if there is a document selected
 */
export const EditorRenderer: React.FC = () => {
  const {
    currentDocument,
    isDocumentLoading,
    // unsyncedDocs,
  } = useMainState()
  const { /* isModified, */ saveDocument } = useEditorState()

  return (
    <OutermosterContainer>
      <EditorTabsBar />
      <OutermostContainer>
        {isDocumentLoading ? (
          <DocumentLoadingState />
        ) : currentDocument ? (
          <>
            {/* 
            <div>
              {isModified
                ? "MODIFIED"
                : unsyncedDocs.includes(currentDocument.id)
                ? "SAVED & UNREPLICATED"
                : "SYNCED"}
            </div> 
            */}

            <ImageModalProvider>
              <LinkModalProvider>
                <EditorComponent
                  key={currentDocument.id} // Necessary to reload the component on id change
                  currentDocument={currentDocument}
                  saveDocument={saveDocument}
                />
              </LinkModalProvider>
            </ImageModalProvider>
          </>
        ) : (
          // This div is here to prevent issues with split pane rendering
          // TODO: add proper empty state
          <div>No document selected</div>
        )}
      </OutermostContainer>
    </OutermosterContainer>
  )
}

const EditorComponent: React.FC<{
  // we get the currentDocument from a prop because inside this component it can't be null
  currentDocument: DocumentDoc
  saveDocument: SaveDocumentFn
}> = ({ currentDocument, saveDocument }) => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))

  // const { isSpellCheckEnabled } = useUserdata()
  const { onChange } = useEditorState()

  const { openMenu, isMenuOpen, renderContextMenu } = useEditorContextMenu()

  // TODO: check if this is still needed
  // const fixSelection = () => {
  //   // This workaround aims to fix the issue with the cursor being visually stuck inside the node toolbar or other custom elements inside the editable area.
  //   // Fun fact: the caret seems to actually be inside the editable parent component and not the toolbar as it would seem
  //   // TODO: It is a quick and dirty solution and might not work sometimes and be triggered when it shouldn't - this should be addressed
  //   // TODO: find the root cause of this issue, it might be related to some internal slate bug that could be fixed upstream
  //   // TODO: there is still an issue where the selection is messed up after clicking at the InsertNodeBlock
  //   setTimeout(() => {
  //     if (!ReactEditor.isFocused) return
  //     const selection = document.getSelection()
  //     // if there is no slate selection there is nothing to restore it from
  //     if (!editor.selection) {
  //       selection?.empty()
  //       return
  //     }
  //     // this checks if both anchor and focus nodes of the DOM selection are in a node that is not a TEXT_NODE (which suggests that the selection is invalid)
  //     if (selection && selection.focusNode && selection.anchorNode) {
  //       // restore the DOM selection from slate selection
  //       const slateNode = Node.get(editor, editor.selection.anchor.path)
  //       const domNode = ReactEditor.toDOMNode(editor, slateNode)
  //       const editorEl = ReactEditor.toDOMNode(editor, editor)
  //       if (
  //         domNode.closest(`[data-slate-editor]`) === editorEl &&
  //         domNode.closest(`[data-slate-node]`) === editorEl
  //       ) {
  //         selection.setPosition(domNode)
  //       }
  //     }
  //   }, 0)
  // }

  // const handleFixSelection = (event: React.KeyboardEvent) => {
  //   if (isHotkey(["Del"], event)) {
  //     fixSelection()
  //   }
  // }

  // /**
  //  * Focus the correct element on mount
  //  */
  // useEffect(() => {
  //   // don't focus content because it can lead to issues if and is not very intuitive (maybe focus the end)
  //   if (title === "") {
  //     titleRef.current?.focus()
  //   }
  //   // eslint-disable-next-line
  // }, [])

  /*
    TODO: this solution might be a bit too basic and might need to be replaced with normalization
    It should also take into account the depth of the path and the type of the node (e.g. list items)
    TODO: this should probably be merged with a solution for selecting the correct block by clicking
    next to it - my best guess is, it would be an event listener on the entire editor area that would
    get the position of the click and compare it to the bounding boxes of blocks until it finds the
    correct one (this would be a good place to use a more efficient search algorithm as it's not
    insignificantly expensive to compare the positions of many nodes)
  */
  // const handleInsertEmptyBlock = (event: MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault()

  //   const newPath = [editor.children.length]
  //   const lastPath = Path.previous(newPath)
  //   const [lastNode] = Editor.node(editor, lastPath, { edge: "end" })

  //   // TODO: this is a temporary solution for the use of the unsafe logic below
  //   if (!("text" in lastNode)) {
  //     throw new Error("This node has to be a leaf node")
  //   }

  //   // TODO: this assumes that the node is a leaf (which should always be true because of the way we get it but might cause issues in the future and should probably have some fallbacks)
  //   if (lastNode.text === "") {
  //     Transforms.select(editor, lastPath)
  //   } else {
  //     Transforms.insertNodes(editor, createEmptyNode(), {
  //       at: newPath,
  //       select: true,
  //     })
  //   }
  //   ReactEditor.focus(editor)
  // }

  const editableProps: EditableProps = useMemo(
    () => ({
      placeholder: "Start writing…",
      spellCheck: /* isSpellCheckEnabled */ false, // TODO: change this back when I restore userdata preferences
      onKeyDown: (e) => {
        // TODO: try using this event in the entire editor area as it would be more intuitive I think
        // TODO: also apply renaming (if focus is in the title input)
        if (isHotkey("mod+s", e)) {
          e.preventDefault()
          saveDocument()
        }
      },
      onBlur: (e) => {
        // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
        saveDocument()
      },
      onMouseDown: (
        event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      ) => {
        // TODO: handle this better
        if (editor === undefined) {
          console.log("can't open context menu because editor is undefined")
          return
        }

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
                openMenu(event, { base: "expanded" })
              }
              return
            }

            const selectionTargetParent = domSelection.anchorNode?.parentElement

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
            openMenu(event, { base: "collapsed" })
            return
          }

          const slateNode = ReactEditor.toSlateNode(
            editor,
            eventTargetParentSlateNode
          )

          // open context menu for a slate node TODO: it would probably be better to somehow notify the react component that it should handle this, it could also set some custom highlighting styles etc.
          if ("type" in slateNode) {
            event.preventDefault()
            openMenu(event, {
              base: "node",
              node: eventTargetParentSlateNode,
            })
            return
          } else {
            return // TODO: better handle this
          }
        }
      },
    }),
    [editor, openMenu, saveDocument]
  )

  return (
    <>
      {currentDocument.isDeleted && (
        <TrashBanner documentId={currentDocument.id} />
      )}
      <OuterContainer>
        <InnerContainer>
          <EditableContainer>
            <Plate
              id="main"
              plugins={pluginsList}
              components={components}
              options={options}
              editableProps={editableProps}
              initialValue={deserialize(currentDocument.content)}
              onChange={onChange}
            >
              <TitleInput currentDocument={currentDocument} />
              <Toolbar />
              {/* <ToolbarSearchHighlight icon={Search} setSearch={setSearch} /> */}
              {/* <BallonToolbarMarks /> */}
              {/* <MentionSelect
                    {...getMentionSelectProps()}
                    renderLabel={renderMentionLabel}
                  /> 
              */}
            </Plate>
            {isMenuOpen && renderContextMenu()}
          </EditableContainer>

          {/* <HoveringToolbar /> */}
        </InnerContainer>
      </OuterContainer>
    </>
  )
}

export default EditorComponent
