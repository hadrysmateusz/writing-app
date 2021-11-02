import {
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
  createCodeBlockPlugin,
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createNodeIdPlugin,
  createAutoformatPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  createSelectOnBackspacePlugin,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_PARAGRAPH,
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

import autoformatRules from "./autoformatRules"

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

export const plugins = [
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

export default plugins
