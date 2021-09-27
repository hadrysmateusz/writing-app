import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  getPlatePluginType,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_HR,
  SPEditor,
  insertEmptyCodeBlock,
  ELEMENT_DEFAULT,
  isElement,
  TEditor,
  AutoformatBlockRule,
  unwrapList,
  isType,
  getParent,
  toggleList,
  setNodes,
  insertNodes,
  AutoformatRule,
  ELEMENT_TODO_LI,
  ELEMENT_LI,
  TodoListItemNodeData,
  TElement,
  // ToolbarLink,
} from "@udecode/plate"
import { Editor } from "slate"

// Autoformat utils from https://github.com/udecode/plate/blob/e9f1e30e8ae1e35e2d18c3ca01352aa3cc31ed47/docs/src/live/config/autoformat/autoformatUtils.ts#L14 TODO: move to separate file

export const clearBlockFormat: AutoformatBlockRule["preFormat"] = (editor) =>
  unwrapList(editor as SPEditor)

export const format = (editor: TEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParent(editor, editor.selection)
    if (!parentEntry) return
    const [node] = parentEntry
    if (
      isElement(node) &&
      !isType(editor as SPEditor, node, ELEMENT_CODE_BLOCK) &&
      !isType(editor as SPEditor, node, ELEMENT_CODE_LINE)
    ) {
      customFormatting()
    }
  }
}

export const formatList = (editor: TEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor as SPEditor, {
      type: elementType,
    })
  )
}

export const formatText = (editor: TEditor, text: string) => {
  format(editor, () => editor.insertText(text))
}

const autoformatRules: AutoformatRule[] = [
  {
    mode: "block",
    type: ELEMENT_H1,
    match: "# ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_H2,
    match: "## ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_H3,
    match: "### ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_H4,
    match: "#### ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_H5,
    match: "##### ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_H6,
    match: "###### ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_BLOCKQUOTE,
    match: "> ",
    preFormat: clearBlockFormat,
  },
  {
    mode: "block",
    type: ELEMENT_HR,
    match: ["---", "—-"],
    preFormat: clearBlockFormat,
    format: (editor) => {
      setNodes(editor, { type: ELEMENT_HR })
      insertNodes(editor, {
        type: ELEMENT_DEFAULT,
        children: [{ text: "" }],
      })
    },
  },
  {
    mode: "block",
    type: ELEMENT_CODE_BLOCK,
    match: "```",
    triggerAtBlockStart: false,
    preFormat: clearBlockFormat,
    format: (editor) => {
      insertEmptyCodeBlock(editor as SPEditor, {
        defaultType: getPlatePluginType(editor as SPEditor, ELEMENT_DEFAULT),
        insertNodesOptions: { select: true },
      })
    },
  },
  {
    mode: "block",
    type: ELEMENT_LI,
    match: ["* ", "- "],
    preFormat: clearBlockFormat,
    format: (editor) => formatList(editor, ELEMENT_UL),
  },
  {
    mode: "block",
    type: ELEMENT_LI,
    match: ["1. ", "1) "], // TODO: figure out a way to make this work with any number (maybe by modifying the autoformat code to allow regexp's or simply by including numbers up to 10 or higher)
    preFormat: clearBlockFormat,
    format: (editor) => formatList(editor, ELEMENT_OL),
  },
  {
    mode: "block",
    type: ELEMENT_TODO_LI,
    match: "[] ",
  },
  {
    mode: "block",
    type: ELEMENT_TODO_LI,
    match: "[x] ",
    format: (editor) =>
      setNodes<TElement<TodoListItemNodeData>>(
        editor,
        { type: ELEMENT_TODO_LI, checked: true },
        {
          match: (n) => Editor.isBlock(editor, n),
        }
      ),
  },
  {
    mode: "mark",
    type: [MARK_BOLD, MARK_ITALIC],
    match: "***",
  },
  {
    mode: "mark",
    type: [MARK_BOLD, MARK_ITALIC],
    match: "___",
  },
  {
    mode: "mark",
    type: MARK_BOLD,
    match: "**",
  },
  {
    mode: "mark",
    type: MARK_BOLD,
    match: "__",
  },
  {
    mode: "mark",
    type: MARK_ITALIC,
    match: "*",
  },
  {
    mode: "mark",
    type: MARK_ITALIC,
    match: "_",
  },
  {
    mode: "mark",
    type: MARK_STRIKETHROUGH,
    match: "~~",
  },

  {
    mode: "mark",
    type: MARK_CODE,
    match: "`",
  },
]

export default autoformatRules
