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
  KEYS_HEADING,
  createDeserializeAstPlugin,
  createDeserializeDocxPlugin,
  createDeserializeHtmlPlugin,
  createDeserializeMdPlugin,
  createPlugins,
  createPlateUI,
  withProps,
  CodeBlockElement,
  BlockquoteElement,
} from "@udecode/plate"
import styled from "styled-components/macro"

import autoformatRules from "./autoformatRules"

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
}

const ParagraphElementS = styled.div`
  margin: 8px 0;
  /* margin: 16px 0; */
`

const ParagraphElement = (props) => {
  return <ParagraphElementS {...props} {...props.attributes} />
}

export const pluginsList = createPlugins(
  [
    createReactPlugin(),
    createHistoryPlugin(),

    // marks
    createBoldPlugin(),
    createItalicPlugin(),
    createCodePlugin(),
    createLinkPlugin(),
    createUnderlinePlugin(), // TODO: think whether I should remove it or not
    createStrikethroughPlugin(),

    // elements
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin({
      // TODO: turn syntax highlighting back on when I figure out why it's having issues
      options: { syntax: false, syntaxPopularFirst: true },
    }),
    createHeadingPlugin(),
    createListPlugin(),
    createTodoListPlugin(),
    createImagePlugin(),
    createHorizontalRulePlugin(),

    // createTablePlugin(),
    // createMediaEmbedPlugin(),
    // createAlignPlugin(),
    // createHighlightPlugin(),
    // createSubscriptPlugin(),
    // createSuperscriptPlugin(),
    // createFontColorPlugin(),
    // createFontBackgroundColorPlugin(),
    // createFontSizePlugin(),
    // createKbdPlugin(),
    createNodeIdPlugin(),
    createAutoformatPlugin({
      options: {
        rules: autoformatRules,
      },
    }),
    createResetNodePlugin({
      options: {
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
      },
    }),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: "shift+enter" },
          {
            hotkey: "enter",
            query: {
              allow: [
                ELEMENT_CODE_BLOCK /* , ELEMENT_BLOCKQUOTE */ /* , ELEMENT_TD */,
              ],
            },
          },
        ],
      },
    }),
    createExitBreakPlugin({
      options: {
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
      },
    }), // TODO: this doesn't seem to work in e.g. an image caption
    // createNormalizeTypesPlugin({
    //   rules: [{ path: [0], strictType: ELEMENT_H1 }],
    // }),
    createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
    createSelectOnBackspacePlugin({
      options: { query: { allow: [ELEMENT_IMAGE, ELEMENT_HR] } },
    }),
    createDeserializeDocxPlugin(),
    createDeserializeHtmlPlugin(),
    createDeserializeMdPlugin(),
    createDeserializeAstPlugin(),
  ],
  {
    components: createPlateUI({
      [ELEMENT_CODE_BLOCK]: withProps(CodeBlockElement, {
        styles: { root: { background: "var(--dark-400)" } },
      }),
      [ELEMENT_PARAGRAPH]: withProps(ParagraphElement, {}),
      [ELEMENT_BLOCKQUOTE]: withProps(BlockquoteElement, {
        styles: {
          root: {
            borderLeft: "3px solid var(--dark-600)",
            /* background: "var(--light-100)", */ color: "var(--light-300)",
          },
        },
      }),
    }),
  }
)

// plugins.push(
//   ...[
//     createDeserializeDocxPlugin({ plugins }),
//     createDeserializeHtmlPlugin({ plugins }),
//     createDeserializeMdPlugin({ plugins }),
//     createDeserializeAstPlugin({ plugins }),
//   ]
// )

export default pluginsList
