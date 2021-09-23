// import isHotkey from "is-hotkey"
// import {
//   Ancestor,
//   Editor,
//   Element,
//   NodeEntry,
//   Path,
//   Range,
//   Transforms,
// } from "slate"
// import {
//   getAboveByType,
//   isBlockAboveEmpty,
//   isFirstChild,
//   isNodeTypeIn,
//   isRangeAtRoot,
//   isSelectionAtBlockStart,
//   isBlockTextEmptyAfterSelection,
//   onKeyDownResetBlockType,
// } from "@udecode/slate-plugins"
// import { unwrapList, isList } from "./helpers"
// import { ELEMENT_LIST_ITEM, ELEMENT_PARAGRAPH } from "../../../slateTypes"

// const ListHotkey = {
//   TAB: "Tab",
//   ENTER: "Enter",
//   DELETE_BACKWARD: "Backspace",
// }

// /**
//  * Move a list item next to its parent.
//  * The parent should be a list item.
//  */
// const moveUp = (
//   editor: Editor,
//   listNode: Ancestor,
//   listPath: number[],
//   listItemPath: number[]
// ) => {
//   const [listParentNode, listParentPath] = Editor.parent(editor, listPath)
//   if (listParentNode.type !== ELEMENT_LIST_ITEM) return

//   const newListItemPath = Path.next(listParentPath)

//   // Move item one level up
//   Transforms.moveNodes(editor, {
//     at: listItemPath,
//     to: newListItemPath,
//   })

//   /**
//    * Move the next siblings to a new list
//    */
//   const listItemIdx = listItemPath[listItemPath.length - 1]
//   const siblingPath = [...listItemPath]
//   const newListPath = newListItemPath.concat(1)
//   let siblingFound = false
//   let newSiblingIdx = 0
//   listNode.children.forEach((n, idx) => {
//     if (listItemIdx < idx) {
//       if (!siblingFound) {
//         siblingFound = true

//         Transforms.insertNodes(
//           editor,
//           {
//             type: listNode.type,
//             children: [],
//           },
//           { at: newListPath }
//         )
//       }

//       siblingPath[siblingPath.length - 1] = listItemIdx
//       const newSiblingsPath = newListPath.concat(newSiblingIdx)
//       newSiblingIdx++
//       Transforms.moveNodes(editor, {
//         at: siblingPath,
//         to: newSiblingsPath,
//       })
//     }
//   })

//   // Remove sublist if it was the first list item
//   if (!listItemIdx) {
//     Transforms.removeNodes(editor, {
//       at: listPath,
//     })
//   }

//   return true
// }

// const moveDown = (
//   editor: Editor,
//   listNode: Ancestor,
//   listItemPath: number[]
// ) => {
//   // Previous sibling is the new parent
//   const previousSiblingItem = Editor.node(
//     editor,
//     Path.previous(listItemPath)
//   ) as NodeEntry<Ancestor>

//   if (previousSiblingItem) {
//     const [previousNode, previousPath] = previousSiblingItem

//     const sublist = previousNode.children.find(isList) as Element | undefined
//     const newPath = previousPath.concat(
//       sublist ? [1, sublist.children.length] : [1]
//     )

//     if (!sublist) {
//       // Create new sublist
//       Transforms.wrapNodes(
//         editor,
//         { type: listNode.type, children: [] },
//         { at: listItemPath }
//       )
//     }

//     // Move the current item to the sublist
//     Transforms.moveNodes(editor, {
//       at: listItemPath,
//       to: newPath,
//     })
//   }
// }

// const handleMoveList = (e: KeyboardEvent, editor: Editor) => {
//   let moved: boolean | undefined = false

//   if (Object.values(ListHotkey).includes(e.key)) {
//     if (
//       editor.selection &&
//       isNodeTypeIn(editor, ELEMENT_LIST_ITEM) &&
//       !isRangeAtRoot(editor.selection)
//     ) {
//       if (e.key === ListHotkey.TAB) {
//         e.preventDefault()
//       }

//       // If selection is in li > p
//       const [paragraphNode, paragraphPath] = Editor.parent(
//         editor,
//         editor.selection
//       )
//       if (paragraphNode.type !== ELEMENT_PARAGRAPH) return
//       const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath)
//       if (listItemNode.type !== ELEMENT_LIST_ITEM) return
//       const [listNode, listPath] = Editor.parent(editor, listItemPath)

//       // move up
//       const shiftTab = e.shiftKey && e.key === ListHotkey.TAB

//       const enterOnEmptyBlock =
//         e.key === ListHotkey.ENTER && isBlockAboveEmpty(editor)
//       const deleteAtBlockStart =
//         e.key === ListHotkey.DELETE_BACKWARD && isSelectionAtBlockStart(editor)

//       if (shiftTab || enterOnEmptyBlock || deleteAtBlockStart) {
//         moved = moveUp(editor, listNode, listPath, listItemPath)
//         if (moved) e.preventDefault()
//       }

//       // move down
//       const tab = !e.shiftKey && e.key === ListHotkey.TAB
//       if (tab && !isFirstChild(listItemPath)) {
//         moveDown(editor, listNode, listItemPath)
//       }
//     }
//   }

//   return moved
// }

// export const onKeyDownList = (options: any) => (
//   e: KeyboardEvent,
//   editor: Editor
// ) => {
//   const moved = handleMoveList(e, editor)

//   const resetBlockTypesListRule = {
//     types: [ELEMENT_LIST_ITEM],
//     defaultType: ELEMENT_PARAGRAPH,
//     onReset: (_editor: Editor) => unwrapList(_editor),
//   }

//   onKeyDownResetBlockType({
//     rules: [
//       {
//         ...resetBlockTypesListRule,
//         hotkey: "Enter",
//         predicate: () => !moved && isBlockAboveEmpty(editor),
//       },
//       {
//         ...resetBlockTypesListRule,
//         hotkey: "Backspace",
//         predicate: () => !moved && isSelectionAtBlockStart(editor),
//       },
//     ],
//   })(e, editor)

//   /**
//    * Add a new list item if selection is in a LIST_ITEM > ELEMENT_PARAGRAPH.
//    */
//   if (!moved && isHotkey("Enter", e)) {
//     if (editor.selection && !isRangeAtRoot(editor.selection)) {
//       const paragraphEntry = getAboveByType(editor, ELEMENT_PARAGRAPH)
//       if (!paragraphEntry) return
//       const [, paragraphPath] = paragraphEntry

//       const [listItemNode, listItemPath] = Editor.parent(editor, paragraphPath)
//       if (listItemNode.type !== ELEMENT_LIST_ITEM) return

//       if (!Range.isCollapsed(editor.selection)) {
//         Transforms.delete(editor)
//       }

//       const isStart = Editor.isStart(
//         editor,
//         editor.selection.focus,
//         paragraphPath
//       )
//       const isEnd = isBlockTextEmptyAfterSelection(editor)

//       const nextParagraphPath = Path.next(paragraphPath)
//       const nextListItemPath = Path.next(listItemPath)

//       /**
//        * If start, insert a list item before
//        */
//       if (isStart) {
//         Transforms.insertNodes(
//           editor,
//           {
//             type: ELEMENT_LIST_ITEM,
//             children: [{ type: ELEMENT_PARAGRAPH, children: [{ text: "" }] }],
//           },
//           { at: listItemPath }
//         )
//         return e.preventDefault()
//       }

//       /**
//        * If not end, split nodes, wrap a list item on the new paragraph and move it to the next list item
//        */
//       if (!isEnd) {
//         Transforms.splitNodes(editor, { at: editor.selection })
//         Transforms.wrapNodes(
//           editor,
//           {
//             type: ELEMENT_LIST_ITEM,
//             children: [],
//           },
//           { at: nextParagraphPath }
//         )
//         Transforms.moveNodes(editor, {
//           at: nextParagraphPath,
//           to: nextListItemPath,
//         })
//       } else {
//         /**
//          * If end, insert a list item after and select it
//          */
//         Transforms.insertNodes(
//           editor,
//           {
//             type: ELEMENT_LIST_ITEM,
//             children: [{ type: ELEMENT_PARAGRAPH, children: [{ text: "" }] }],
//           },
//           { at: nextListItemPath }
//         )
//         Transforms.select(editor, nextListItemPath)
//       }

//       /**
//        * If there is a list in the list item, move it to the next list item
//        */
//       if (listItemNode.children.length > 1) {
//         Transforms.moveNodes(editor, {
//           at: nextParagraphPath,
//           to: nextListItemPath.concat(1),
//         })
//       }

//       return e.preventDefault()
//     }
//   }
// }

export const onKeyDownList = () => {}
