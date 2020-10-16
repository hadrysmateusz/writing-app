import { EditorOverrides } from "@slate-plugin-system/core"
import {
  Block,
  isBlockTextEmpty,
  isFirstChild,
  isLastChild,
} from "../../../slate-helpers"
import { isImageUrl, insertImage } from "./helpers"
import { IMAGE } from "./types"
import { Range, Node, Path, Transforms } from "slate"
import { ReactEditor } from "slate-react"

export const withImage = (
  _options: any
): EditorOverrides<ReactEditor, ReactEditor> => (editor: ReactEditor) => {
  const { insertData, isVoid, deleteBackward, deleteForward } = editor

  // TODO: consider preventing removing image nodes when they are not selected (this requires checking if the cursor is at the first/last position)

  editor.deleteBackward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const [currentNode, currentPath] = Block.closest(editor)
      if (!isFirstChild(currentPath)) {
        const previousNode = Node.get(editor, Path.previous(currentPath))
        if (
          isBlockTextEmpty(currentNode) &&
          currentNode.type !== IMAGE &&
          previousNode.type === IMAGE
        ) {
          Transforms.removeNodes(editor)
          return
        }
      }
    }
    deleteBackward(unit)
  }

  editor.deleteForward = (unit) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const [currentNode, nextPath] = Block.closest(editor)
      if (!isLastChild(editor, nextPath)) {
        const nextNode = Node.get(editor, Path.next(nextPath))
        if (
          isBlockTextEmpty(currentNode) &&
          currentNode.type !== IMAGE &&
          nextNode.type === IMAGE
        ) {
          Transforms.removeNodes(editor)
          // this causes history issues (undoing requires two steps into one)
          // I believe this is the same issue that I have with move nodes -
          // when undoing the selection operation is applied first and the node tree has changed so it gets applied incorrectly
          // I could try to use more lower-level logic to make sure the selection stays consistent
          // or I could investigate how slate-history works and implement some sort of batching
          Transforms.select(editor, nextPath)
          return
        }
      }
    }
    deleteForward(unit)
  }

  editor.isVoid = (element) => {
    return element.type === IMAGE ? true : isVoid(element)
  }

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain")
    const { files } = data
    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split("/")
        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result
            if (url) insertImage(editor, url)
          })
          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
