import { Transforms, Path, Editor } from "slate"

// import { ReactEditor } from "slate-react"
// import {
//   getSelectedNodes,
//   isFirstChild,
//   isLastChild,
// } from "../../../slate-helpers"
// import { setSelectionAfterMoving } from "./helpers"

// const moveNodes = (editor: Editor, from: Path[], to: Path) => {
//   if (!editor.selection) {
//     // TODO: better handle this
//     console.log("no selection")
//     return
//   }

//   const oldSelection = editor.selection

//   // Deselecting messes up history
//   // Transforms.deselect(editor)

//   // TODO: History is messed up after moving
//   Transforms.moveNodes(editor, {
//     at: oldSelection,
//     to,
//     match: (node) => {
//       const path = ReactEditor.findPath(editor as ReactEditor, node)
//       const matches = from.some((fullPath) => {
//         if (path.length === fullPath.length) {
//           return fullPath.every((index, i) => path[i] === index)
//         }
//         return false
//       })
//       return matches
//     },
//     mode: "all",
//   })

//   // Without this the selection is messed up after moving (may be a slate bug)
//   setSelectionAfterMoving(editor, from, to, oldSelection)
// }

export const onKeyDownMoveNodes = () => (e: KeyboardEvent, editor: Editor) => {
  // if (e.altKey && ["ArrowUp", "ArrowDown"].includes(e.key)) {
  //   e.preventDefault()
  //   if (!editor.selection) return
  //   // This gets the common paths at the shallowest possible depth
  //   const selectedNodes = getSelectedNodes(editor, "asc")
  //   if (selectedNodes === null) {
  //     console.warn("Can't move nodes. No nodes selected.")
  //     return
  //   }
  //   const { fullPaths } = selectedNodes
  //   const firstPath = fullPaths[0]
  //   const lastPath = fullPaths[fullPaths.length - 1]
  //   let newPath
  //   /* Currently moving outside of the current node is disabled with the
  //      isFirstChild/isLastChild checks to prevent errors but eventually
  //      it should be replaced by moving into the parent node */
  //   switch (e.key) {
  //     case "ArrowUp":
  //       if (isFirstChild(firstPath)) break
  //       newPath = Path.previous(firstPath)
  //       moveNodes(editor, fullPaths, newPath)
  //       break
  //     case "ArrowDown":
  //       if (isLastChild(editor, lastPath)) break
  //       newPath = Path.next(lastPath)
  //       moveNodes(editor, fullPaths, newPath)
  //       break
  //   }
  // }
}
