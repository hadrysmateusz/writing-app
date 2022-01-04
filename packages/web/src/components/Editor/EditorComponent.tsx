import { useCallback, useEffect, useMemo } from "react"
import { ReactEditor } from "slate-react"
import { EditableProps } from "slate-react/dist/components/editable"
import isHotkey from "is-hotkey"
import { getPlateActions, Plate, usePlateEditorRef } from "@udecode/plate"

import { GenericDocument_Discriminated } from "../../types"

import { useEditorState } from "../EditorStateProvider"
import { useTabsDispatch } from "../TabsProvider"

import {
  EditableContainer,
  OuterContainer,
  InnerContainer,
} from "./EditorComponent.styles"
import { useEditorContextMenu } from "./hooks"
import { pluginsList } from "./config"
import TitleInput from "./TitleInput"
import { BalloonToolbar, Toolbar } from "./Toolbars"

type EditorComponentProps = {
  // handlers for actions that differ based on document/editor type
  saveDocument: () => void
  renameDocument: (value: string) => void

  // document object itself (could be replaced by name, content pair if this solution causes too many unnecessary re-renders)
  genericDocument: GenericDocument_Discriminated
}

/**
 * The editor component itself. Handles rendering an editor for any type of document
 */
export const EditorComponent: React.FC<EditorComponentProps> = ({
  saveDocument,
  renameDocument,
  genericDocument,
}) => {
  const tabsDispatch = useTabsDispatch()
  const { onChange } = useEditorState()
  const editor = usePlateEditorRef()

  const { openMenu, isMenuOpen, renderContextMenu } = useEditorContextMenu()

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
        if (!editor) {
          console.log("can't open context menu because editor is undefined")
          return
        }

        // If the right-mouse-button is clicked, prevent the selection from being changed and trigger the correct context menu
        // TODO: this code seems to have some issues now
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

  useEffect(() => {
    // Effect responsible for resetting the zustand/zustood or whatever it is, plate editor store for the given document identifier (plate editor id corresponds to document ids), because resetting the editor is synchronous there is no need for any kind of loading state to delay rendering the Plate component
    console.log("new generic document", genericDocument.identifier)
    getPlateActions(genericDocument.identifier).resetEditor()
  }, [genericDocument.identifier])

  /* TODO: maybe use an rxdb subscription to the remove event to check for permanent deletion to close the tab (maybe do it higher up) */
  return (
    <OuterContainer onKeyDown={handleContainerKeyDown}>
      <div className="Editor_TopShadow" />
      <InnerContainer>
        <EditableContainer>
          <Plate
            key={genericDocument.identifier}
            id={genericDocument.identifier} // important for rendering and using correct state based on the document being edited
            plugins={pluginsList}
            editableProps={editableProps}
            initialValue={JSON.parse(genericDocument.content)}
            onChange={onChange}
          >
            <TitleInput
              title={genericDocument.name}
              onRename={renameDocument}
            />
            <Toolbar />
            <BalloonToolbar />
          </Plate>
          {isMenuOpen && renderContextMenu()}
        </EditableContainer>
      </InnerContainer>
    </OuterContainer>
  )
}

export default EditorComponent
