import { Editor, Transforms } from "slate"
// import { isNodeTypeIn, wrapNodes, getNodesByType } from "@udecode/slate-plugins"

import { unwrapList } from "./unwrapList"

import { DEFAULT } from "../../../../slate-helpers"
import { ListType } from "../../../../slateTypes"

export const toggleList = (editor: Editor, listType: string) => {
  // if (!editor.selection) return
  // const isActive = isNodeTypeIn(editor, listType)
  // unwrapList(editor)
  // Transforms.setNodes(editor, {
  //   type: DEFAULT,
  // })
  // if (!isActive) {
  //   const list = { type: listType, children: [] }
  //   wrapNodes(editor, list)
  //   // get default (paragraph) nodes inside the selection that will become list items
  //   const nodes = [...getNodesByType(editor, DEFAULT)]
  //   for (const [, path] of nodes) {
  //     const listItem = { type: ListType.LIST_ITEM, children: [] }
  //     Transforms.wrapNodes(editor, listItem, { at: path })
  //   }
  // }
}
