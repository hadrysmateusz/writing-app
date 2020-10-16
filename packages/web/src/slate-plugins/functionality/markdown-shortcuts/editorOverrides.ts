import { Editor, Range, Transforms, Text } from "slate"
import { composeOverrides } from "@slate-plugin-system/core"
import {
  MarkdownShortcutsPluginOptions,
  ShortcutUnit,
  ShortcutsList,
} from "./types"
import { BOLD, ITALIC } from "../../marks"

export const withBlockShortcuts = ({
  types = {},
  shortcutOverrides = {},
  onToggleOverrides = {},
}: MarkdownShortcutsPluginOptions = {}) => <T extends Editor>(editor: T) => {
  const { insertText } = editor

  // deconstruct the types from the types object (replace missing with defaults)
  const {
    UL = "bulleted_list",
    OL = "numbered_list",
    BLOCKQUOTE = "blockquote",
    CODE_BLOCK = "code_block",
    H1 = "heading_1",
    H2 = "heading_2",
    H3 = "heading_3",
    H4 = "heading_4",
    H5 = "heading_5",
    H6 = "heading_6",
  } = types

  const shortcuts: ShortcutsList = {
    [OL]: /\d+\./,
    [UL]: ["*", "-", "+"],
    [BLOCKQUOTE]: ">",
    [CODE_BLOCK]: "```",
    [H1]: "#",
    [H2]: "##",
    [H3]: "###",
    [H4]: "####",
    [H5]: "#####",
    [H6]: "######",
    ...shortcutOverrides,
  }

  editor.insertText = (text) => {
    const { selection } = editor
    let wasShortcutTriggered = false

    if (text === " " && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)

      const onToggleOverridesKeys = Object.keys(onToggleOverrides)
      const onToggleOverridesValues = Object.values(onToggleOverrides)

      const doShortcut = (type: string, shortcut: ShortcutUnit) => {
        const indexOfOverride = onToggleOverridesKeys.indexOf(type)

        // delete the shortcut text
        Transforms.select(editor, range)
        Transforms.delete(editor)

        // change the node type
        if (indexOfOverride === -1) {
          Transforms.setNodes(
            editor,
            { type: type },
            { match: (n) => Editor.isBlock(editor, n) }
          )
        } else {
          // if there is an override function for this type trigger it instead
          const toggleFn = onToggleOverridesValues[indexOfOverride]
          toggleFn(editor, type, shortcut)
        }
      }

      const checkMatch = (shortcut: ShortcutUnit, type: string): boolean => {
        // check if the text matches the shortcut
        let isMatch =
          shortcut instanceof RegExp
            ? shortcut.test(beforeText)
            : shortcut === beforeText
        // if it does, trigger the handler
        if (isMatch) doShortcut(type, shortcut)
        // return the result of the check to let the caller know if a match was found
        return isMatch
      }

      // check all of the shortcuts for a match
      // Array.some is used to stop checking if a match is found
      const shortcutEntries = Object.entries(shortcuts)
      wasShortcutTriggered = shortcutEntries.some(([type, shortcutMatch]) => {
        // if the match is an array, check all of it's contents
        return Array.isArray(shortcutMatch)
          ? shortcutMatch.some((shortcut) => checkMatch(shortcut, type))
          : checkMatch(shortcutMatch, type)
      })
    }

    if (!wasShortcutTriggered) {
      // if the text was a space but no shortcut was triggered
      insertText(text)
    }
  }

  return editor
}

export const withInlineShortcuts = (
  _options: MarkdownShortcutsPluginOptions
) => <T extends Editor>(editor: T) => {
  const { normalizeNode } = editor

  const matchers = {
    [BOLD]: /(\*\*|__)(.*?)\1/,
    [ITALIC]: /(\*|_)(.*?)\1/,
  }

  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    Object.entries(matchers).some(([format, matcher]) => {
      const match = matcher.exec(typeof node.text === "string" ? node.text : "")
      if (!match) return false
      const textContent = match[2]
      const textLength = textContent.length
      if (textLength === 0) return false

      const fullMatch = match[0]
      const startIndex = match.index
      const endIndex = match.index + textContent.length

      // delete the matched text (including the shortcut characters)
      Transforms.delete(editor, {
        at: { path, offset: startIndex },
        distance: fullMatch.length,
      })

      // insert only the text content (without the shortcut characters)
      Transforms.insertText(editor, textContent)

      // set the correct mark on the new text content
      Transforms.setNodes(
        editor,
        { [format]: true },
        {
          match: Text.isText,
          split: true,
          at: {
            anchor: { path, offset: startIndex },
            focus: { path, offset: endIndex },
          },
        }
      )

      // TODO: this doesn't work fi there is any text afterwards
      // The setTimeout is necessary for the removeMark to work, but it might not be bullet-proof so more testing is required
      setTimeout(() => {
        console.log("children", JSON.stringify(editor.children, null, 2))
        console.log("selection", JSON.stringify(editor.selection, null, 2))
        console.log("marks", editor.marks)
        // clear the mark, so that whatever is typed next doesn't have it
        Editor.removeMark(editor, format)
        Transforms.insertText(editor, "")
        console.log("children", JSON.stringify(editor.children, null, 2))
        console.log("selection", JSON.stringify(editor.selection, null, 2))
        console.log("marks", editor.marks)
      }, 0)

      return true
    })

    normalizeNode(entry)
  }

  return editor
}

export const withShortcuts = (options: MarkdownShortcutsPluginOptions = {}) =>
  composeOverrides([withBlockShortcuts(options), withInlineShortcuts(options)])
