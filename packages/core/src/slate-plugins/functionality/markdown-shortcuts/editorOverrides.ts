import { Editor, Range, Transforms, Text } from "slate"
import { composeOverrides } from "@slate-plugin-system/core"
import { MarkdownShortcutsPluginOptions, ShortcutUnit, ShortcutsList } from "./types"

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
          shortcut instanceof RegExp ? shortcut.test(beforeText) : shortcut === beforeText
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

export const withInlineShortcuts = ({
  types = {},
  shortcutOverrides = {},
  onToggleOverrides = {},
}: MarkdownShortcutsPluginOptions = {}) => <T extends Editor>(editor: T) => {
  const { normalizeNode } = editor

  const matchers = {
    bold: /(\*\*|__)(.*?)(\*\*|__)/,
    italic: /(\*|_)(.*?)(\*|_)\1/g,
  }

  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    const result = matchers.bold.exec(node.text)
    if (result) {
      const textContent = result[2]
      const textLength = textContent.length
      if (textLength === 0) {
        // don't do shit
      }
      const fullMatch = result[0]
      const startIndex = result.index
      const endIndex = result.index + textContent.length


      Transforms.delete(editor, {
        at: { path, offset: startIndex },
        distance: fullMatch.length,
      })

      Transforms.insertText(editor, textContent)

      Transforms.setNodes(
        editor,
        { bold: true },
        {
          match: Text.isText,
          split: true,
          at: { anchor: { path, offset: startIndex }, focus: { path, offset: endIndex } },
        }
      )

      console.log(fullMatch, textContent, startIndex, endIndex)
    }

    normalizeNode(entry)
  }

  return editor
}

export const withShortcuts = (options: MarkdownShortcutsPluginOptions) =>
  composeOverrides([withBlockShortcuts(options), withInlineShortcuts(options)])
