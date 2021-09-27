import React, {
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
  MouseEvent,
  useMemo,
} from "react"
import styled from "styled-components/macro"
import { ReactEditor } from "slate-react"
import { Transforms, Path, Editor, Node } from "slate"
import isHotkey from "is-hotkey"
import {
  Plate,
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createTodoListPlugin,
  createHeadingPlugin,
  createImagePlugin,
  createHorizontalRulePlugin,
  createLinkPlugin,
  createListPlugin,
  createTablePlugin,
  createMediaEmbedPlugin,
  createCodeBlockPlugin,
  createAlignPlugin,
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createHighlightPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createFontSizePlugin,
  createKbdPlugin,
  createNodeIdPlugin,
  createAutoformatPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createExitBreakPlugin,
  createNormalizeTypesPlugin,
  createTrailingBlockPlugin,
  createSelectOnBackspacePlugin,
  createPlateComponents,
  createPlateOptions,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_PARAGRAPH,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  getPlatePluginType,
  useStoreEditorRef,
  useEventEditorId,
  HeadingToolbar,
  ToolbarElement,
  ToolbarMark,
  ToolbarList,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LINK,
  ELEMENT_HR,
  ELEMENT_IMAGE,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  ELEMENT_TODO_LI,
  ResetBlockTypePluginOptions,
  SoftBreakPluginOptions,
  ExitBreakPluginOptions,
  KEYS_HEADING,
  createDeserializeCSVPlugin,
  createDeserializeMDPlugin,
  createDeserializeHTMLPlugin,
  createDeserializeAstPlugin,
} from "@udecode/plate"
import { EditableProps } from "slate-react/dist/components/editable"

// import HoveringToolbar from "../HoveringToolbar"
import { NamingInput } from "../RenamingInput"
import { DocumentDoc } from "../Database"
import { SaveDocumentFn, useMainState } from "../MainProvider"
import TrashBanner from "../TrashBanner"
import { useDocumentsAPI } from "../MainProvider"
import { useUserdata } from "../Userdata"
import { useViewState } from "../ViewState"
import { useEditorState } from "../EditorStateProvider"
import Toolbar from "../Toolbar"

import { createEmptyNode } from "../../helpers/createEmptyNode"
import { withDelayRender } from "../../withDelayRender"

import {
  EditableContainer,
  OuterContainer,
  OutermostContainer,
  InsertBlockField,
  InnerContainer,
} from "./styledComponents"
import useEditorContextMenu from "./useEditorContextMenu"
import { deserialize } from "."
import autoformatRules from "./autoformatRules"

const DocumentLoadingState = withDelayRender(1000)(() => <div>Loading</div>)

/**
 * Renders the editor if there is a document selected
 */
export const EditorRenderer: React.FC = () => {
  const { currentDocument, isDocumentLoading, unsyncedDocs } = useMainState()
  const { secondarySidebar } = useViewState()
  const { isModified, saveDocument } = useEditorState()

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

          <EditorTabsContainer>
            <EditorTab />
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

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
}

export const optionsResetBlockTypePlugin: ResetBlockTypePluginOptions = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Enter",
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: "Backspace",
      predicate: isSelectionAtBlockStart,
    },
  ],
}

export const optionsSoftBreakPlugin: SoftBreakPluginOptions = {
  rules: [
    { hotkey: "shift+enter" },
    {
      hotkey: "enter",
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE /* , ELEMENT_TD */],
      },
    },
  ],
}

export const optionsExitBreakPlugin: ExitBreakPluginOptions = {
  rules: [
    {
      hotkey: "mod+enter",
    },
    {
      hotkey: "mod+shift+enter",
      before: true,
    },
    {
      hotkey: "enter",
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING,
      },
    },
  ],
}

const EditorComponent: React.FC<{
  // we get the currentDocument from a prop because inside this component it can't be null
  currentDocument: DocumentDoc
  saveDocument: SaveDocumentFn
}> = ({ currentDocument, saveDocument }) => {
  const { isDocumentLoading, currentEditor } = useMainState()
  const { renameDocument } = useDocumentsAPI()
  const editor = useStoreEditorRef(useEventEditorId("focus"))

  const [title, setTitle] = useState<string>(currentDocument.title)
  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const { openMenu, isMenuOpen, renderContextMenu } = useEditorContextMenu()
  const { isSpellCheckEnabled } = useUserdata()

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

  const pluginsMemo = useMemo(() => {
    const plugins = [
      createReactPlugin(),
      createHistoryPlugin(),
      createParagraphPlugin(),
      createBlockquotePlugin(),
      createTodoListPlugin(),
      createHeadingPlugin(),
      createImagePlugin(),
      createHorizontalRulePlugin(),
      createLinkPlugin(),
      createListPlugin(),
      // createTablePlugin(),
      // createMediaEmbedPlugin(),
      createCodeBlockPlugin(),
      // createAlignPlugin(),
      createBoldPlugin(),
      createCodePlugin(),
      createItalicPlugin(),
      // createHighlightPlugin(),
      createUnderlinePlugin(),
      createStrikethroughPlugin(),
      // createSubscriptPlugin(),
      // createSuperscriptPlugin(),
      // createFontColorPlugin(),
      // createFontBackgroundColorPlugin(),
      // createFontSizePlugin(),
      // createKbdPlugin(),
      createNodeIdPlugin(),
      createAutoformatPlugin({
        rules: autoformatRules,
      }),
      createResetNodePlugin(optionsResetBlockTypePlugin),
      createSoftBreakPlugin(optionsSoftBreakPlugin),
      createExitBreakPlugin(optionsExitBreakPlugin), // TODO: this doesn't seem to work in e.g. an image caption
      // createNormalizeTypesPlugin({
      //   rules: [{ path: [0], strictType: ELEMENT_H1 }],
      // }),
      createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }), // TODO: this doesn't seem to always work
      createSelectOnBackspacePlugin({ allow: [ELEMENT_IMAGE, ELEMENT_HR] }),
    ]

    plugins.push(
      ...[
        createDeserializeMDPlugin({ plugins }),
        createDeserializeCSVPlugin({ plugins }),
        createDeserializeHTMLPlugin({ plugins }),
        createDeserializeAstPlugin({ plugins }),
      ]
    )

    return plugins
  }, [])

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
                  plugins={pluginsMemo}
                  components={components}
                  options={options}
                  editableProps={editableProps}
                  initialValue={getInitialEditorValue()}
                >
                  <Toolbar />
                  {/* <ToolbarSearchHighlight icon={Search} setSearch={setSearch} /> */}
                  {/* <ToolbarButtonsList /> */}
                  {/* <ToolbarLink icon={<Link />} />  */}
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
            //   {/* <Toolbar /> */}
            //   <StyledNamingInput
            //     ref={titleRef}
            //     value={title}
            //     onChange={handleTitleChange}
            //     onKeyDown={handleTitleKeydown}
            //     onRename={handleRename}
            //   />
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

const EditorTab = styled.div`
  width: 150px;
  height: var(--tab-size);
  background: var(--bg-200);
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
`

const OutermosterContainer = styled.div`
  min-width: 500px; // TODO: probably change this with media queries
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;
`

export default EditorComponent
