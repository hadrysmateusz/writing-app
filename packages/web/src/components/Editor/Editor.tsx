import React, { useState, useRef, useEffect, useMemo, FC } from "react"
import styled from "styled-components/macro"
import { ReactEditor } from "slate-react"
import { Transforms } from "slate"
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
import { NamingInput } from "../RenamingInput"
import { DocumentDoc, useDatabase } from "../Database"
import {
  SaveDocumentFn,
  useGroupsAPI,
  useMainState,
  useTabsState,
} from "../MainProvider"
import TrashBanner from "../TrashBanner"
import { useDocumentsAPI } from "../MainProvider"
// import { useUserdata } from "../Userdata"
// import { useViewState } from "../ViewState"
import { useEditorState } from "../EditorStateProvider"
import Toolbar from "../Toolbar"

import { createEmptyNode } from "../../helpers/createEmptyNode"
import { withDelayRender } from "../../withDelayRender"

import {
  EditableContainer,
  OuterContainer,
  OutermostContainer,
  // InsertBlockField,
  InnerContainer,
} from "./styledComponents"
import useEditorContextMenu from "./useEditorContextMenu"
import { deserialize } from "."
import pluginsList from "./pluginsList"
import { formatOptional } from "../../utils"

const DocumentLoadingState = withDelayRender(1000)(() => <div>Loading</div>)

/**
 * Renders the editor if there is a document selected
 */
export const EditorRenderer: React.FC = () => {
  const {
    currentDocument,
    isDocumentLoading,
    // unsyncedDocs,
    openDocument,
  } = useMainState()
  const tabsState = useTabsState()
  // const { secondarySidebar } = useViewState()
  const { /* isModified, */ saveDocument } = useEditorState()
  const { createDocument } = useDocumentsAPI()

  return (
    <OutermosterContainer>
      {isDocumentLoading ? (
        <DocumentLoadingState />
      ) : currentDocument ? (
        <>
          {/* <button
            onClick={() => {
              secondarySidebar.toggle()
            }}
          >
            sidebar
          </button>

          <div>
            {isModified
              ? "MODIFIED"
              : unsyncedDocs.includes(currentDocument.id)
              ? "SAVED & UNREPLICATED"
              : "SYNCED"}
          </div> */}

          {/* <div>{isModified ? "Unsaved changes" : "Saved"}</div> */}

          <EditorTabsContainer
            onClick={async (e) => {
              if (e.target === e.currentTarget) {
                const document = await createDocument(null, undefined, {
                  switchToDocument: false,
                })
                openDocument(document.id, { inNewTab: true })
              }
            }}
          >
            {Object.keys(tabsState.tabs).map((tabId) => (
              <EditorTab key={tabId} tabId={tabId} />
            ))}
          </EditorTabsContainer>

          <EditorComponent
            key={currentDocument.id} // Necessary to reload the component on id change
            currentDocument={currentDocument}
            saveDocument={saveDocument}
          />
        </>
      ) : (
        // This div is here to prevent issues with split pane rendering
        // TODO: add proper empty state
        <div>No document selected</div>
      )}
    </OutermosterContainer>
  )
}

const components = createPlateComponents()
const options = createPlateOptions()

const EditorComponent: React.FC<{
  // we get the currentDocument from a prop because inside this component it can't be null
  currentDocument: DocumentDoc
  saveDocument: SaveDocumentFn
}> = ({ currentDocument, saveDocument }) => {
  const editor = useStoreEditorRef(useEventEditorId("focus"))

  const { onChange } = useEditorState()
  const { isDocumentLoading, currentEditor } = useMainState()
  const { renameDocument } = useDocumentsAPI()
  const { openMenu, isMenuOpen, renderContextMenu } = useEditorContextMenu()
  // const { isSpellCheckEnabled } = useUserdata()

  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)

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

  // When the document title changes elsewhere, update the state here
  useEffect(() => {
    console.log("updating title")
    setTitle(currentDocument.title)
  }, [currentDocument.title])

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

  const handleRename = (newValue: string) => {
    renameDocument(currentDocument.id, newValue)
  }

  const handleTitleKeydown = (event: React.KeyboardEvent) => {
    if (editor === undefined) {
      console.error("editor is undefined ")
      return false
    }

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

  const getInitialEditorValue = () => {
    return deserialize(currentDocument.content)
  }

  return (
    <OutermostContainer>
      {currentDocument.isDeleted && (
        <TrashBanner documentId={currentDocument.id} />
      )}
      <OuterContainer>
        <InnerContainer>
          {currentDocument && !isDocumentLoading && currentEditor && (
            <>
              <StyledNamingInput
                ref={titleRef}
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeydown}
                onRename={handleRename}
              />
              <EditableContainer>
                <Plate
                  id="main"
                  plugins={pluginsList}
                  components={components}
                  options={options}
                  editableProps={editableProps}
                  initialValue={getInitialEditorValue()}
                  onChange={onChange}
                >
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
            </>
            // <>
            //   {/* <HoveringToolbar /> */}
            //   <ListContext.Provider value={{ listLevel: 0 }}>
            //     <ListItemContext.Provider value={{ listItemDirectNode: null }}>
            //       <EditableContainer
            //         onBlur={handleContentBlur}
            //         onMouseDown={handleEditorMouseDown}
            //       >
            //         <Editable
            //           plugins={plugins}
            //           placeholder="Start writing"
            //           onKeyDown={[handleSaveDocument, handleFixSelection]}
            //           spellCheck={isSpellCheckEnabled}
            //         />
            //         <InsertBlockField onMouseDown={handleInsertEmptyBlock} />

            //         {isMenuOpen && renderContextMenu()}
            //       </EditableContainer>
            //     </ListItemContext.Provider>
            //   </ListContext.Provider>
            // </>
          )}
        </InnerContainer>
      </OuterContainer>
    </OutermostContainer>
  )
}

const initialTabData = { title: "", group: null }

const EditorTab: FC<{ tabId: string }> = ({ tabId }) => {
  const db = useDatabase()
  const tabsState = useTabsState()
  const { findGroupById } = useGroupsAPI()
  const { openDocument } = useMainState()

  const isActive = tabsState.currentTab === tabId
  const tab = tabsState.tabs[tabId]
  const [tabData, setTabData] = useState<{
    title: string
    group: string | null
  }>(initialTabData)

  useEffect(() => {
    if (tab.documentId === null) {
      setTabData(initialTabData)
      return undefined
    }
    const sub = db.documents.findOne(tab.documentId).$.subscribe((doc) => {
      if (!doc) {
        // TODO: handle this more gracefully
        throw new Error("Document not found")
      }
      const title = formatOptional(doc?.title, "Untitled")

      if (!doc?.parentGroup) {
        setTabData({
          title: title,
          group: "",
        })
      } else {
        findGroupById(doc.parentGroup).then((group) => {
          setTabData({
            title: title,
            group: group.name,
          })
        })
      }
    })
    return () => sub.unsubscribe()
  }, [db.documents, findGroupById, tab.documentId])

  const handleClick = () => {
    if (isActive) {
      return
    }
    openDocument(tab.documentId)
  }

  return (
    <EditorTabContainer isActive={isActive} onClick={handleClick}>
      <div className="tab-title">{tabData.title}</div>
      {tabData.group ? <div className="tab-group">{tabData.group}</div> : null}
      {/* TODO: add close button */}
    </EditorTabContainer>
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

const EditorTabsContainer = styled.div`
  background: var(--bg-100);
  height: var(--tab-size);
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: start;
`

const EditorTabContainer = styled.div<{ isActive: boolean }>`
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;
  color: ${({ isActive }) => (isActive ? "#f6f6f6" : "#A3A3A3")};
  background: ${({ isActive }) => (isActive ? "var(--bg-200)" : "transparent")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .tab-group {
    margin-left: 9px;
    font-size: 10px;
    color: ${({ isActive }) => (isActive ? "#717171" : "#545454")};
  }
`

const OutermosterContainer = styled.div`
  min-width: 500px; // TODO: probably change this with media queries
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;
`

export default EditorComponent
