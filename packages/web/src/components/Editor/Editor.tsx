import React, { useCallback, useEffect, useMemo, useState } from "react"

import { ReactEditor } from "slate-react"
import { EditableProps } from "slate-react/dist/components/editable"
import isHotkey from "is-hotkey"
import { Plate, usePlateEditorRef, usePlateEventId } from "@udecode/plate"

// import HoveringToolbar from "../HoveringToolbar"
// import { useUserdata } from "../Userdata"
// import { useViewState } from "../ViewState"
import { useDatabase } from "../Database"
import {
  DEFAULT_EDITOR_VALUE,
  useDocumentsAPI,
  useTabsState,
} from "../MainProvider"
import TrashBanner from "../TrashBanner"
import { useEditorState } from "../EditorStateProvider"
import { Toolbar } from "../Toolbar"
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
import { DummyEditor } from "./DummyEditor"
import { useRxSubscription } from "../../hooks"
import { BalloonToolbar } from "./BalloonToolbar"
import { useTabsDispatch } from "../MainProvider"
import { Descendant } from "slate"
import { myDeserializeMd, mySerializeMd } from "../../slate-helpers/deserialize"

const DocumentLoadingState = withDelayRender(1000)(() => <div>Loading...</div>)

const DocumentEmptyState = withDelayRender(1000)(() => (
  // This div is here to prevent issues with split pane rendering, TODO: add proper empty state
  <div style={{ padding: "40px" }}>No document selected</div>
))

/**
 * Renders the editor if there is a document selected
 */
export const EditorRenderer: React.FC = () => {
  const { tabs, currentTab } = useTabsState()

  // Handles rendering the editor based on tab type
  function renderCorrectEditor() {
    let currentTabObj = tabs[currentTab]
    // TODO: probably precompute this and expose in useTabsState hook
    const currentTabType = currentTabObj.tabType
    if (currentTabType === "cloudNew") return <DummyEditor />
    if (currentTabType === "cloudDocument")
      return <CloudEditor currentDocumentId={currentTabObj.documentId} />
    if (currentTabType === "localDocument")
      return <LocalEditor currentDocumentPath={currentTabObj.path} />
    return <DocumentEmptyState />
  }

  return (
    <OutermosterContainer>
      <EditorTabsBar />
      <OutermostContainer>
        <ImageModalProvider>
          <LinkModalProvider>{renderCorrectEditor()}</LinkModalProvider>
        </ImageModalProvider>
      </OutermostContainer>
    </OutermosterContainer>
  )
}

const LocalEditor: React.FC<{ currentDocumentPath: string }> = ({
  currentDocumentPath,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<Descendant[]>()
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  useEffect(() => {
    ;(async () => {
      console.log("LOCAL EDITOR USEEFFECT")
      setIsLoading(true)

      const ipcResponse = await window.electron.invoke("OPEN_FILE", {
        filePath: currentDocumentPath,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        // TODO: handle possible data-shape errors
        setTitle(ipcResponse.data.file.fileName)
        // TODO: support other deserializers
        // I'm using my custom deserializer as it's practically identical to the plate one and doesn't require the editor object which would require a big restructuring of this code
        // const deserializer = { md: deserializeMarkdown }["md"]

        // TODO: this is the previous working thingy
        let deserialized = myDeserializeMd(ipcResponse.data.file.content)
        if (deserialized.length === 0) {
          deserialized = DEFAULT_EDITOR_VALUE
        }

        console.log("deserialized:", deserialized)
        setContent(deserialized)
      } else {
        // TODO: handle this
        console.warn("something went wrong")
      }

      setIsLoading(false)
    })()
  }, [currentDocumentPath])

  console.log(title, content)

  return !isLoading && content && title ? (
    <EditorComponent
      key={currentDocumentPath}
      saveDocument={async () => {
        if (!editor) {
          console.warn("no editor")
          return
        }

        console.log(editor.children)

        const serializedContent = mySerializeMd(editor.children)

        console.log("serialized:", serializedContent)

        const ipcResponse = await window.electron.invoke("WRITE_FILE", {
          filePath: currentDocumentPath,
          content: serializedContent,
        })
        console.log(ipcResponse)
      }}
      renameDocument={() => {
        console.log("TODO: implement")
      }}
      title={title}
      content={content}
      isDeleted={false}
      documentId=""
    />
  ) : isLoading ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

const CloudEditor: React.FC<{ currentDocumentId: string }> = ({
  currentDocumentId,
}) => {
  const db = useDatabase()
  const { saveDocument } = useEditorState()
  const { renameDocument } = useDocumentsAPI()
  const editor = usePlateEditorRef(usePlateEventId("focus"))

  // TODO: maybe make the main state provider use the rx subscription hook
  const {
    data: currentDocument,
    isLoading: isDocumentLoading,
  } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  const content = useMemo(
    () => (currentDocument ? deserialize(currentDocument.content) : []),
    [currentDocument]
  )

  const handleRename = useCallback(
    (value: string) => {
      renameDocument(currentDocumentId, value)
    },
    [currentDocumentId, renameDocument]
  )

  return currentDocument ? (
    <EditorComponent
      key={currentDocument.id} // Necessary to reload the component on id change
      saveDocument={() => {
        console.log("children", editor?.children)

        saveDocument()
      }}
      renameDocument={handleRename}
      title={currentDocument.title}
      content={content}
      isDeleted={currentDocument.isDeleted}
      documentId={currentDocumentId}
    />
  ) : isDocumentLoading ? (
    <DocumentLoadingState />
  ) : (
    <DocumentEmptyState />
  )
}

const EditorComponent: React.FC<{
  saveDocument: () => void
  renameDocument: (value: string) => void
  title: string
  content: Descendant[]
  // TODO: probably move the dependency on isDeleted and documentId up and outside of this component
  isDeleted: boolean
  documentId: string
}> = ({
  saveDocument,
  title,
  content,
  renameDocument,
  isDeleted,
  documentId,
}) => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))
  const tabsDispatch = useTabsDispatch()
  const { onChange } = useEditorState()
  // const { isSpellCheckEnabled } = useUserdata()

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
      spellCheck: /* isSpellCheckEnabled */ false, // TODO: change this back when I restore userdata
      onBlur: (_e) => {
        // TODO: if you close the window or reload without clicking on something else the blur doesn't trigger and the content doesn't get saved
        saveDocument()
      },
      onFocus: (_e) => {
        tabsDispatch({ type: "keep-tab", tabId: null })
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
                openMenu(event, {
                  base: "expanded",
                  node: eventTargetParentSlateNode,
                })
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

          if (
            selectionTargetParentSlateNode?.isSameNode(
              eventTargetParentSlateNode
            )
          ) {
            openMenu(event, {
              base: "collapsed",
              node: eventTargetParentSlateNode,
            })
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
    [editor, openMenu, saveDocument, tabsDispatch]
  )

  const handleContainerKeyDown = useCallback(
    (e) => {
      if (isHotkey("mod+s", e)) {
        e.preventDefault()
        saveDocument()
      }
    },
    [saveDocument]
  )

  return (
    <>
      {/* TODO: maybe use an rxdb subscription to the update event to check for deletion to display the banner (maybe keep isDeleted in local state) */}
      {/* TODO: maybe use an rxdb subscription to the remove event to check for permanent deletion to close the tab (maybe do it higher up) */}
      {isDeleted && <TrashBanner documentId={documentId} />}
      <OuterContainer onKeyDown={handleContainerKeyDown}>
        <div className="Editor_TopShadow" />
        <InnerContainer>
          <EditableContainer>
            <Plate
              id="main"
              plugins={pluginsList}
              editableProps={editableProps}
              initialValue={content}
              onChange={onChange}
            >
              <TitleInput title={title} onRename={renameDocument} />
              <Toolbar />
              <BalloonToolbar />
              {/* <ToolbarSearchHighlight icon={Search} setSearch={setSearch} /> */}
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
